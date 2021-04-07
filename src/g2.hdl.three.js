(function register() {
    g2.handler.factory.push((ctx) => {
        const width = ctx.drawingBufferWidth;
        const height = ctx.drawingBufferHeight;
        const renderer = new THREE.WebGLRenderer({ gl: ctx, canvas: ctx.canvas });

        const scene = new THREE.Scene();
        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);
        const v = new THREE.Vector2();
        renderer.setSize(width, height);
        renderer.getSize(v);

        const camera = new THREE.OrthographicCamera(0, v.width, 0, v.height);
        camera.position.set(0, 0, 1);

        return Object.assign({}, g2ThreeHandler, { ctx, camera, scene, renderer });
    });
})();


const g2ThreeHandler = {
    ctx: undefined,
    scene: undefined,
    camera: undefined,
    matrix: [new THREE.Matrix4()],
    init(commands) {
        return true;
    },
    render() {
        this.renderer.render(this.scene, this.camera);
        // Necessary when native module:
        this.ctx.endFrameEXP && this.ctx.endFrameEXP();
    },
    exe(commands) {
        // this.matrix = [new THREE.Matrix4()];
        for (let cmd of commands) {
            if (cmd.a && cmd.a.g2) {
                const cmds = cmd.a.g2().commands;
                // If false, ext was not applied to this cmd. But the command still renders
                if (cmds) {
                    this.exe(cmds);
                    continue;
                }
            }
            else if (cmd.a && cmd.a.commands) {
                this.exe(cmd.a.commands);
                continue;
            }
            if (cmd.c && this[cmd.c]) {
                this[cmd.c](cmd.a);
            } else {
                console.log(`couldnt find ${cmd.c}`)
            }
        }
        this.render();
    },
    view(a) {
        this.beg(a);
    },
    grid(a) {
        // TODO
    },
    clr() {
        // TODO
    },
    cir(a) {
        this.arc({ ...a, w: 0, dw: 2 * Math.PI });
    },
    arc(a) {
        this.ell({ ...a, rx: a.r, ry: a.r });
    },
    ell(a) {
        this.p();
        this.m({ x: 0, y: 0 });
        this._path.currentPath.add(new THREE.EllipseCurve(
            a.x, a.y,  // ax, aY
            a.rx, a.ry,  // xRadius, yRadius
            a.w, a.dw, // aStartAngle, aEndAngle
            false,     // aClockwise
            0          // aRotation
        ));
        this.fill(a);
        this.stroke(a);
    },
    rec(a) {
        const { x, y, b, h, lw, ls = '#000', fs } = a;
        this.p();
        this.m({ x: x, y: y });
        this.l({ x: x + b, y: y });
        this.l({ x: x + b, y: y + h });
        this.l({ x: x, y: y + h });
        this.z();
        this.fill(a);
        this.stroke(a);
    },
    lin(a) {
        this.p();
        this.m({ x: a.x1, y: a.y1 });
        this.l({ x: a.x2, y: a.y2 });
        this.stroke(a);
    },
    _notTransaprent(fs) {
        return !fs && fs !== 'transparent';
    },
    ply(a) {
        const pts = Array.isArray(a.pts[0]) ? a.pts.flat() : a.pts[0].x ? a.pts.map(a => [a.x, a.y]).flat() : a.pts;
        this.p();
        this.m({ x: pts[0], y: pts[1] });
        for (let i = 2, j = 3; j < pts.length; i += 2, j += 2) {
            this.l({ x: pts[i], y: pts[j] });
        }
        if (a.closed) {
            this.z();
        }
        this._notTransaprent(a.fs) && this.fill(a);
        this.stroke(a);
    },
    // TODO txt needs some work...
    font: undefined,
    loadFont(a) {
        // const loader = new THREE.FontLoader();
        // loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        //     this.font = font;
        //     this._txt(a);
        //     this.render();
        // });
    },
    txt(a) {
        // TODO
        // if (this.font) {
        //     this._txt(a);
        // } else {
        //     this.loadFont(a);
        // }
    },
    img() {
        // TODO
    },
    use(a) {
        this.beg(a);
        this.exe(a.grp.commands);
        this.end();
    },
    cartesian: false,
    beg(a) {
        const { x = 0, y = 0, w = 0, scl = 1 } = a;
        const m = new THREE.Matrix4();
        const rotate = new THREE.Quaternion();
        rotate.setFromAxisAngle(new THREE.Vector3(0, 0, 1), w);
        const translate = new THREE.Vector3(x, y, 0);
        const scale = new THREE.Vector3(scl, scl, 1);
        m.compose(translate, rotate, scale);
        this.stack.push(this.setStyle(a));
        this.matrix.push(m)
    },
    end() {
        this.stack.pop();
        if (this.matrix.length > 1) {
            this.matrix.pop();
        }
    },
    applyMatrix(geometry) {
        for (const matrix of this.matrix) {
            geometry.applyMatrix4(matrix);
        }
    },
    stroke(a) {
        // NOTE this cuts off the previously defined path
        if (a && a.d) {
            this._parseSVG(a.d);
        }
        /**
         * If the linewidth is 1 a Line is enough,
         * but if the linewidth is not a rectangle is drawn for each line segment.
         */
        const { ls, lw } = this.setStyle(a);
        if (lw === 0) return; // Short circuit.
        // NOTE This is not true if scale is anything other than 1...
        if (!lw || lw === 1) {
            const material = new THREE.LineBasicMaterial({ color: ls });
            for (const path of this._path.subPaths) {
                const geometry = new THREE.BufferGeometry()
                    .setFromPoints(path.getPoints(200));
                const line = new THREE.Line(geometry, material);
                this.applyMatrix(line);
                this.scene.add(line);
            }
        } else {
            const material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: ls,
            });

            for (const subPath of this._path.subPaths) {
                const path = subPath.getPoints();
                for (let i = 0, j = 1; j < path.length; ++i, ++j) {
                    const angle = Math.atan2(path[j].y - path[i].y, path[j].x - path[i].x);
                    const xoff = lw / 2 * Math.sin(angle);
                    const yoff = lw / 2 * Math.cos(angle);

                    const shape = new THREE.Shape();

                    shape.moveTo(path[i].x + xoff, path[i].y - yoff);
                    shape.lineTo(path[i].x - xoff, path[i].y + yoff);
                    shape.lineTo(path[j].x - xoff, path[j].y + yoff);
                    shape.lineTo(path[j].x + xoff, path[j].y - yoff);

                    const geometry = new THREE.ShapeGeometry(shape);
                    const mesh = new THREE.Mesh(geometry, material);
                    this.applyMatrix(mesh);
                    this.scene.add(mesh);
                }
            }
        }
    },
    fill(a) {
        // NOTE this cuts off the previously defined path
        if (a.d) {
            this._parseSVG(a.d);
        }
        const { fs } = this.setStyle(a);
        if (!fs) return;
        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: fs,
        });

        // TODO This is not working like it should.
        // see g2().drw({lw:4,ls:'#080',fs:'#0f0',d:'M100,10L123.5,82.4L61,37.6'+'L138,37.6L76.5,82.4Z'})
        for (const shape of this._path.toShapes()) {
            const geometry = new THREE.ShapeGeometry(shape);
            const mesh = new THREE.Mesh(geometry, material);
            this.applyMatrix(mesh);
            this.scene.add(mesh);
        }
    },
    _parseSVG(d) {
        this.p();
        for (const cmd of parseSVG(d)) {
            switch (cmd.code) {
                case 'M':
                    this.m({ ...cmd });
                    break;
                case 'L':
                    this.l({ ...cmd });
                    break;
                case 'A':
                    this.a({ ...cmd });
                    break;
                case 'Q':
                    this.q({ ...cmd });
                    break;
                case 'C':
                    this.c({ ...cmd });
                    break;
                case 'Z':
                    this.z({ ...cmd });
                    break;
                default:
                    break;
            }
        }
    },
    drw(a) {
        this._parseSVG(a.d);
        this.fill(a);
        this.stroke(a);
    },
    a(a) {
        const { x = 0, y = 0, dw = 0, _xp = 0, _yp = 0} = a;
        const x12 = x - _xp;
        const y12 = y - _yp;
        const tdw_2 = Math.tan(dw / 2);
        const rx = (x12 - y12 / tdw_2) / 2;
        const ry = (y12 + x12 / tdw_2) / 2;
        const R = Math.hypot(rx, ry);
        const w = Math.atan2(-ry, -rx);
        this._path.currentPath.arc(rx, ry, R, w, w + a.dw, a.dw < 0);
    },
    _path: undefined,
    p() {
        this._path = new THREE.ShapePath();
    },
    m(a) {
        this._path.moveTo(a.x, a.y);
    },
    l(a) {
        this._path.lineTo(a.x, a.y);
    },
    q(a) {
        this._path.quadraticCurveTo(a.x1, a.y1, a.x, a.y);
    },
    c(a) {
        this._path.bezierCurveTo(a.x1, a.y1, a.x2, a.y2, a.x, a.y);
    },
    z() {
        this._path.currentPath.closePath();
    },
    stack: [],
    setStyle(s) {
        const a = this.stack;
        const ds = g2.defaultStyle;
        const getStyle = (key) => {
            let stack
            for (let i = 0; i < this.stack.length; ++i) {
                if (this.stack[i][key]) {
                    stack = this.stack[i][key];
                    break;
                }
            }
            let link;
            if (typeof s[key] === 'string' && s[key][0] === '@') {
                let ref = s[key].substr(1);
                if (s.hasOwnProperty(ref)) {
                    link = s[ref];
                }
                else {
                    link = g2.symbol[ref];
                }
            }
            const ret = link || s[key] || stack || ds[key];
            if (key === 'fs' && ret === 'transparent' || !ret ) {
              return false;
            }
            return ret;
        }
        return {
            lw: getStyle('lw'),
            fs: getStyle('fs'),
            ls: getStyle('ls'),
        }
    },
};
