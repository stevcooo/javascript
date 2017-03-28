(function () {
    var vreme1 = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - vreme1));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            vreme1 = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

var FinkiPingPong = new function () {
    var boards = [];

    var snd = new Audio("Sounds/soundtrack.mp3");    
    snd.play();
    snd.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);    

    this.initialize = function (finkiCanvas, grafika, callback) {
        this.canvas = document.getElementById(finkiCanvas);

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
        if (!this.ctx) { return alert("Вашиот прелистуваш не поддржува HTML5."); }

        this.tastatura();

        this.loop();
        SlikaAkteri.mapiraj(grafika, callback);
    };

    var komandi = { 37: 'levo', 39: 'desno', 38: 'gore', 40: 'dolu', 32: 'puk' };
    this.kopcina = {};

    this.tastatura = function () {
        window.addEventListener('keydown', function (e) {
            if (komandi[e.keyCode]) {
                FinkiPingPong.kopcina[komandi[e.keyCode]] = true;
                e.preventDefault();
            }
        }, false);

        window.addEventListener('keyup', function (e) {
            if (komandi[e.keyCode]) {
                FinkiPingPong.kopcina[komandi[e.keyCode]] = false;
                e.preventDefault();
            }
        }, false);

        window.addEventListener('mousedown', function (e) {
            if (e.pageY > window.innerHeight - 100) {
                if (e.pageX < (window.innerWidth / 2))
                    FinkiPingPong.kopcina['levo'] = true;
            }
            if (e.pageY > window.innerHeight - 100) {
                if (e.pageX > (window.innerWidth / 2))
                    FinkiPingPong.kopcina['desno'] = true;
            }
            else {
                FinkiPingPong.kopcina['puk'] = true;
                e.preventDefault();
            }
            
        }, false);

        window.addEventListener('mouseup', function (e) {
            if (e.pageY > window.innerHeight - 100) {
                if (e.pageX < (window.innerWidth / 2))
                    FinkiPingPong.kopcina['levo'] = false;
            }
            if (e.pageY > window.innerHeight - 100) {
                if (e.pageX > (window.innerWidth/2))
                    FinkiPingPong.kopcina['desno'] = false;
            }
            else {
                FinkiPingPong.kopcina['puk'] = false;
                e.preventDefault();
            }
            
        }, false);

        window.addEventListener('touchstart', function (e) {
            if (e.pageY > window.innerHeight - 100) {
                if (e.pageX < (window.innerWidth / 2))
                    FinkiPingPong.kopcina['levo'] = true;
            }
            if (e.pageY > window.innerHeight - 100) {
                if (e.pageX > (window.innerWidth / 2))
                    FinkiPingPong.kopcina['desno'] = true;
            }
            else {
                FinkiPingPong.kopcina['puk'] = true;
                e.preventDefault();
            }

        }, false);

        window.addEventListener('touchend', function (e) {
            if (e.pageY > window.innerHeight - 100) {
                if (e.pageX < (window.innerWidth / 2))
                    FinkiPingPong.kopcina['levo'] = false;
            }
            if (e.pageY > window.innerHeight - 100) {
                if (e.pageX > (window.innerWidth / 2))
                    FinkiPingPong.kopcina['desno'] = false;
            }
            else {
                FinkiPingPong.kopcina['puk'] = false;
                e.preventDefault();
            }

        }, false);
        
    };


    var vreme1 = new Date().getTime();
    var maksimalnoVreme = 1 / 30;

    this.loop = function () {
        var momentalnoVreme = new Date().getTime();
        requestAnimationFrame(FinkiPingPong.loop);
        var dt = (momentalnoVreme - vreme1) / 1600;
        if (dt > maksimalnoVreme) { dt = maksimalnoVreme; }

        for (var i = 0, len = boards.length; i < len; i++) {
            if (boards[i]) {
                boards[i].step(dt);
                boards[i].iscrtaj(FinkiPingPong.ctx);
            }
        }
        vreme1 = momentalnoVreme;
    };

    this.postavi = function (num, tabla) { boards[num] = tabla; };
};

var SlikaAkteri = new function () {
    this.siteAkteri = {};

    this.mapiraj = function (spriteData, callback) {
        this.siteAkteri = spriteData;
        this.akteri = new Image();
        this.akteri.onload = callback;
        this.akteri.src = 'images/actors.png';
    };

    this.iscrtaj = function (ctx, Akter, x, y, frame, name, kreditiSilaStatus, nameFontSize, kratkoIme) {
        var s = this.siteAkteri[Akter];
        if (!frame) frame = 0;
        ctx.drawImage(this.akteri,
                         s.sx + frame * s.w,
                         s.sy,
                         s.w, s.h,
                         Math.floor(x), Math.floor(y),
                         s.w, s.h);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold " + nameFontSize + "px bangers";
        if (kratkoIme == null)
            ctx.fillText("", Math.floor(x), Math.floor(y));
        else
            ctx.fillText(kratkoIme, Math.floor(x), Math.floor(y));

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold " + 15 + "px bangers";
        if (kreditiSilaStatus == null)
            ctx.fillText("", Math.floor(x), Math.floor(y));
        else
            ctx.fillText(kreditiSilaStatus, Math.floor(x), Math.floor(y) + 60);
    };

    return this;
};

var Naslov = function Naslov(prvRed, vtorRed, callback) {
    var up = false;
    this.step = function (dt) {
        if (!FinkiPingPong.kopcina['puk']) up = true;
        if (up && FinkiPingPong.kopcina['puk'] && callback) callback();
    };

    this.iscrtaj = function (ctx) {
        ctx.fillStyle = "#FFFFFF";

        ctx.font = "bold 40px bangers";
        var measure = ctx.measureText(prvRed);
        ctx.fillText(prvRed, FinkiPingPong.width / 2 - measure.width / 2, FinkiPingPong.height / 2);

        ctx.font = "bold 20px bangers";
        var measure2 = ctx.measureText(vtorRed);
        ctx.fillText(vtorRed, FinkiPingPong.width / 2 - measure2.width / 2, FinkiPingPong.height / 2 + 40);
    };
};

var Finki = function () {
    var tabla = this;

    this.listaObjekti = [];
    this.kontekst = {};

    this.dodadiObject = function (obj) {
        obj.tabla = this;
        this.listaObjekti.push(obj);
        this.kontekst[obj.type] = (this.kontekst[obj.type] || 0) + 1;
        return obj;
    };

    this.otstraniObjekt = function (obj) {
        var idx = this.spremniZaOtsranuvanje.indexOf(obj);
        if (idx == -1) {
            this.spremniZaOtsranuvanje.push(obj);
            return true;
        } else {
            return false;
        }
    };

    this.otstraniOznaceni = function () { this.spremniZaOtsranuvanje = []; };

    this.otstraniOznaceniKraj = function () {
        for (var i = 0, len = this.spremniZaOtsranuvanje.length; i < len; i++) {
            var idx = this.listaObjekti.indexOf(this.spremniZaOtsranuvanje[i]);
            if (idx != -1) {
                this.kontekst[this.spremniZaOtsranuvanje[i].type]--;
                this.listaObjekti.splice(idx, 1);
            }
        }
    };

    this.izmini = function (funkcija) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, len = this.listaObjekti.length; i < len; i++) {
            var obj = this.listaObjekti[i];
            obj[funkcija].apply(obj, args);
        }
    };

    this.pronajdi = function (func) {
        for (var i = 0, val = null, len = this.listaObjekti.length; i < len; i++) {
            if (func.call(this.listaObjekti[i])) return this.listaObjekti[i];
        }
        return false;
    };

    this.pronajdiTip = function (Type) {
        for (var i = 0, val = null, len = this.listaObjekti.length; i < len; i++) {
            if (this.listaObjekti[i].type == Type) return this.listaObjekti[i];
        }
        return false;
    };

    this.step = function (dt) {
        this.otstraniOznaceni();
        this.izmini('step', dt);
        this.otstraniOznaceniKraj();
    };

    this.iscrtaj = function (ctx) {
        this.izmini('iscrtaj', ctx);
    };

    this.preklopuvanje = function (o1, o2) {
        return !((o1.y + o1.h < o2.y) || (o1.y > o2.y + o2.h) ||
                 (o1.x + o1.w < o2.x) || (o1.x > o2.x + o2.w));
    };

    this.kolizija = function (obj, type) {
        return this.pronajdi(function () {
            if (obj != this) {
                var col = (!type || this.type & type) && tabla.preklopuvanje(obj, this);
                return col ? this : false;
            }
        });
    };


};

var Akter = function () { };

Akter.prototype.setup = function (Akter, props) {
    this.Akter = Akter;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w = SlikaAkteri.siteAkteri[Akter].w;
    this.h = SlikaAkteri.siteAkteri[Akter].h;
};

Akter.prototype.merge = function (props) {
    if (props) {
        for (var prop in props) {
            this[prop] = props[prop];
        }
    }
};

Akter.prototype.iscrtaj = function (ctx) {
    SlikaAkteri.iscrtaj(ctx, this.Akter, this.x, this.y, this.frame, this.name, this.kreditiSilaStatus, this.nameFontSize, this.kratkoIme);
};

Akter.prototype.hit = function (damage) {
    this.tabla.otstraniObjekt(this);
};

var Nivo = function (vlezniPodatoci, callback) {
    this.podatoci = [];
    for (var i = 0; i < vlezniPodatoci.length; i++) {
        this.podatoci.push(Object.create(vlezniPodatoci[i]));
    }
    this.t = 0;
    this.callback = callback;
};

Nivo.prototype.step = function (dt) {

    var idx = 0
    var otstraniObjekt = []
    var predmet = null;

    this.t += dt * 1000;


    while ((predmet = this.podatoci[idx]) &&
          (predmet[0] < this.t + 2000)) {
        if (this.t > predmet[1]) {
            otstraniObjekt.push(predmet);
        } else if (predmet[0] < this.t) {
            var newPredmet = predmeti[predmet[3]],
                override = predmet[4];

            this.tabla.dodadiObject(new Predmet(newPredmet, override));

            predmet[0] += predmet[2];
        }
        idx++;
    }

    for (var i = 0, len = otstraniObjekt.length; i < len; i++) {
        var remIdx = this.podatoci.indexOf(otstraniObjekt[i]);
        if (remIdx != -1) this.podatoci.splice(remIdx, 1);
    }

    if (this.podatoci.length === 0 && this.tabla.kontekst[PREDMET_OBJEKT] === 0) {
        if (this.callback) this.callback();
    }

};

Nivo.prototype.iscrtaj = function (ctx) { };

//PrvSemestar
var PrvSemestar = function (vlezniPodatoci, callback) {
    this.podatoci = [];
    for (var i = 0; i < vlezniPodatoci.length; i++) {
        this.podatoci.push(Object.create(vlezniPodatoci[i]));
    }
    this.t = 0;
    this.callback = callback;
};

PrvSemestar.prototype.step = function (dt) {
    

    var idx = 0
    var otstraniObjekt = []
    var predmet = null;

    this.t += dt * 1000;


    while ((predmet = this.podatoci[idx]) &&
          (predmet[0] < this.t + 2000)) {
        if (this.t > predmet[1]) {
            otstraniObjekt.push(predmet);
        } else if (predmet[0] < this.t) {
            var newPredmet = predmeti[predmet[3]],
                override = predmet[4];

            this.tabla.dodadiObject(new Predmet(newPredmet, override));

            predmet[0] += predmet[2];
        }
        idx++;
    }

    for (var i = 0, len = otstraniObjekt.length; i < len; i++) {
        var remIdx = this.podatoci.indexOf(otstraniObjekt[i]);
        if (remIdx != -1) this.podatoci.splice(remIdx, 1);
    }

    if (this.podatoci.length === 0 && this.tabla.kontekst[PREDMET_OBJEKT] === 0) {
                             
        if (this.callback) this.callback();
    }

};

PrvSemestar.prototype.iscrtaj = function (ctx) { };


var Krediti = function () {
    FinkiPingPong.vkupnoKrediti = 0;

    this.iscrtaj = function (ctx) {
        ctx.save();
        ctx.font = "bold 18px";
        ctx.fillStyle = "#FFFFFF";

        var txt = "" + FinkiPingPong.vkupnoKrediti;
        var i = 3 - txt.length
        var prefix = "";
        while (i-- > 0) { prefix += "0"; }

        ctx.fillText("Освоени кредити: " + prefix + txt, 20, 20);
        ctx.restore();
    };

    this.step = function (dt) { };
};


var PolozeniPredmeti = function () {
    FinkiPingPong.polozeniPredmeti = ",";

    this.iscrtaj = function (ctx) {
        ctx.save();
        ctx.font = "bold 18px";
        ctx.fillStyle = "#FFFFFF";


        var rez = FinkiPingPong.polozeniPredmeti.split(",");

        for (var i = 1; i < rez.length; i++) {

        }
        ctx.restore();
    };

    this.step = function (dt) { };
};

var IscistenSemestar = function () {    
    FinkiPingPong.iscisteniSemestri = ",";
    this.iscrtaj = function (ctx) {
        ctx.save();
        ctx.font = "bold 18px";
        ctx.fillStyle = "#FFFFFF";
        
        ctx.fillText("Исчистени семестри: ", 20, 60);

      
        var rez = FinkiPingPong.iscisteniSemestri.split(",");

        for (var i = 1; i < rez.length; i++) {            
            ctx.fillText(rez[i], 20, (20 * i) + 60);
        }
        ctx.restore();
    };

    this.step = function (dt) { };
};