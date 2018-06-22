/**
 * g2.io (c) 2013-17 Stefan Goessner
 * @license MIT License
 * @link https://github.com/goessner/g2
 *
 */
"use strict"

g2.io = function() {
   if (this instanceof g2.io) {
      this.model = null;
      this.grpidx = 0;
      return this;
   }
   return g2.io.apply(Object.create(g2.io.prototype));
};
g2.handler.factory.push((ctx) => ctx instanceof g2.io ? ctx : false);

g2.io.parse = function(str) {
    let model = JSON.parse(str);
    return g2.io.parseGrp(model,'main');
}
g2.io.parseGrp = function(model, id) {
    let g;
    if (id in model) {
        g = g2({id});
        for (let cmd of model[id]) {
            if (cmd.c === 'use')
                cmd.a.grp = g2.io.parseGrp(model, cmd.a.grp);
            else if (this[cmd.c])
                cmd.a ? this[cmd.c](cmd.a) : this[cmd.c]();
            else  // invalid g2 command !
               console.error(`io: Unable to handle command '${cmd.c}'`)
        }
        return g;
    }
    else if (id in g2.symbol)
        return g2.symbol[id];
    return null;
}

g2.io.prototype = {
    init: function(grp,style) {
        this.model = {'main':[]};
        this.curgrp = this.model.main;
        this.grpidx = 0;
        return true;
    },
    exe: function(commands) {
        for (let cmd of commands) {
            if (this[cmd.c])
                cmd.a ? this[cmd.c](cmd.a) : this[cmd.c]();
            else
                this.out(cmd.c,cmd.a);
        }
    },
    out: function(c,a) {
        if (a) {
            let args = {};
            Object.keys(a).forEach(k => {
                if (k[0] !== '_')  // no private key ...
                    args[k] = a[k];
            });
            this.curgrp.push({c:c,a:args});
        }
        else
            this.curgrp.push({c:c});
    },
    stringify: function(space) { return space ? JSON.stringify(this.model,null,space) : JSON.stringify(this.model); },
    toString: function() { return JSON.stringify(this.model); },

    // customized commands ...
    use: function(args) {
        let grp = args.grp instanceof g2 ? args.grp
                : typeof args.grp === 'string' && g2.symbol.includes(args.grp) ? g2.symbol[args.grp]
                : null;
        if (grp) {
            if (!grp.id) grp.id = `$grp${++this.grpidx}`;
            if (!(grp.id in this.model)) { // meet first time ..
                let curgrp = this.curgrp;
                this.curgrp = this.model[grp.id] = [];
                for (let command of grp.commands)
                    this.out(command.c,command.a);
                this.curgrp = curgrp;
            }
            args.grp = grp.id;

            this.out("use", args);
        }
    }
}
