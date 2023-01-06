(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw ((f.code = "MODULE_NOT_FOUND"), f);
            }
            var l = (n[o] = { exports: {} });
            t[o][0].call(
                l.exports,
                function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                },
                l,
                l.exports,
                e,
                t,
                n,
                r
            );
        }
        return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})(
    {
        1: [
            function (require, module, exports) {
                module.exports = function (object, eventType, callback) {
                    var timer;

                    object.addEventListener(
                        eventType,
                        function (event) {
                            clearTimeout(timer);
                            timer = setTimeout(function () {
                                callback(event);
                            }, 500);
                        },
                        false
                    );
                };
            },
            {},
        ],
        2: [
            function (require, module, exports) {
                var Vector2 = require("./vector2");

                var exports = {
                    friction: function (vector, value) {
                        var force = vector.clone();
                        force.multScalar(-1);
                        force.normalize();
                        force.multScalar(value);
                        return force;
                    },
                    drag: function (vector, value) {
                        var force = vector.clone();
                        force.multScalar(-1);
                        force.normalize();
                        force.multScalar(vector.length() * value);
                        return force;
                    },
                    hook: function (v_velocity, v_anchor, k) {
                        var force = v_velocity.clone().sub(v_anchor);
                        var distance = force.length();
                        if (distance > 0) {
                            force.normalize();
                            force.multScalar(-1 * k * distance);
                            return force;
                        } else {
                            return new Vector2();
                        }
                    },
                };

                module.exports = exports;
            },
            { "./vector2": 6 },
        ],
        3: [
            function (require, module, exports) {
                var Util = require("./util");
                var Vector2 = require("./vector2");
                var Force = require("./force");
                var Mover = require("./mover");
                var debounce = require("./debounce");

                var body_width = document.body.clientWidth * 2;
                var body_height = document.body.clientHeight * 2;
                var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext("2d");
                var last_time_activate = Date.now();
                var vector_touch_start = new Vector2();
                var vector_touch_move = new Vector2();
                var vector_touch_end = new Vector2();
                var is_touched = false;

                var movers = [];
                var count_movers = 0;
                var unit_mover = 300;

                var gravity = new Vector2(0, 1);

                var init = function () {
                    poolMover();
                    renderloop();
                    setEvent();
                    resizeCanvas();
                    debounce(window, "resize", function (event) {
                        resizeCanvas();
                    });
                };

                var poolMover = function () {
                    for (var i = 0; i < unit_mover; i++) {
                        var mover = new Mover();

                        movers.push(mover);
                    }
                    count_movers += unit_mover;
                };

                var updateMover = function () {
                    for (var i = 0; i < movers.length; i++) {
                        var mover = movers[i];

                        if (!mover.is_active) continue;

                        if (mover.acceleration.length() < 2) {
                            mover.time++;
                        }
                        if (mover.time > 20) {
                            mover.radius -= mover.radius / 10;
                        }
                        if (mover.radius < 10) {
                            mover.inactivate();
                            continue;
                        }

                        mover.applyForce(gravity);
                        mover.applyFriction();
                        mover.updateVelocity();
                        collideMover(mover, i, movers, true);
                        mover.collideBorder(
                            false,
                            body_width,
                            body_height,
                            0,
                            true
                        );
                        collideMover(mover, i, movers, false);
                        collideMover(mover, i, movers, false);
                        collideMover(mover, i, movers, false);
                        mover.updatePosition();
                        movers[i].draw(ctx);
                    }
                };

                var collideMover = function (
                    mover,
                    i,
                    movers,
                    preserve_impulse
                ) {
                    for (var index = 0; index < movers.length; index++) {
                        if (index === i) continue;
                        mover.collide(movers[index], preserve_impulse);
                    }
                };

                var activateMover = function () {
                    var vector = new Vector2(
                        Util.getRandomInt(0, body_width),
                        (body_height / 2) * -1
                    );
                    var radian = 0;
                    var scalar = 0;
                    var x = 0;
                    var y = 0;
                    var force = new Vector2();

                    for (var i = 0; i < movers.length; i++) {
                        var mover = movers[i];

                        if (mover.is_active) continue;
                        mover.activate();
                        mover.init(vector, (body_width + body_height) / 200);
                        break;
                    }
                };

                var render = function () {
                    ctx.clearRect(0, 0, body_width, body_height);
                    updateMover();
                };

                var renderloop = function () {
                    var now = Date.now();

                    requestAnimationFrame(renderloop);
                    render();
                    if (now - last_time_activate > 10) {
                        activateMover();
                        last_time_activate = Date.now();
                    }
                };

                var resizeCanvas = function () {
                    body_width = document.body.clientWidth * 2;
                    body_height = document.body.clientHeight * 2;

                    canvas.width = body_width;
                    canvas.height = body_height;
                    canvas.style.width = body_width / 2 + "px";
                    canvas.style.height = body_height / 2 + "px";
                };

                var setEvent = function () {
                    var eventTouchStart = function (x, y) {
                        vector_touch_start.set(x, y);
                        is_touched = true;
                    };

                    var eventTouchMove = function (x, y) {
                        vector_touch_move.set(x, y);
                        if (is_touched) {
                        }
                    };

                    var eventTouchEnd = function (x, y) {
                        vector_touch_end.set(x, y);
                        is_touched = false;
                    };

                    canvas.addEventListener("contextmenu", function (event) {
                        event.preventDefault();
                    });

                    canvas.addEventListener("selectstart", function (event) {
                        event.preventDefault();
                    });

                    canvas.addEventListener("mousedown", function (event) {
                        event.preventDefault();
                        eventTouchStart(event.clientX * 2, event.clientY * 2);
                    });

                    canvas.addEventListener("mousemove", function (event) {
                        event.preventDefault();
                        eventTouchMove(event.clientX * 2, event.clientY * 2);
                    });

                    canvas.addEventListener("mouseup", function (event) {
                        event.preventDefault();
                        eventTouchEnd();
                    });

                    canvas.addEventListener("touchstart", function (event) {
                        event.preventDefault();
                        eventTouchStart(
                            event.touches[0].clientX * 2,
                            event.touches[0].clientY * 2
                        );
                    });

                    canvas.addEventListener("touchmove", function (event) {
                        event.preventDefault();
                        eventTouchMove(
                            event.touches[0].clientX * 2,
                            event.touches[0].clientY * 2
                        );
                    });

                    canvas.addEventListener("touchend", function (event) {
                        event.preventDefault();
                        eventTouchEnd();
                    });
                };

                init();
            },
            {
                "./debounce": 1,
                "./force": 2,
                "./mover": 4,
                "./util": 5,
                "./vector2": 6,
            },
        ],
        4: [
            function (require, module, exports) {
                var Util = require("./util");
                var Vector2 = require("./vector2");
                var Force = require("./force");

                var exports = function () {
                    var Mover = function () {
                        this.position = new Vector2();
                        this.velocity = new Vector2();
                        this.acceleration = new Vector2();
                        this.anchor = new Vector2();
                        this.radius = 0;
                        this.mass = 1;
                        this.direction = 0;
                        this.r = Util.getRandomInt(200, 255);
                        this.g = Util.getRandomInt(0, 180);
                        this.b = Util.getRandomInt(0, 50);
                        this.a = 1;
                        this.time = 0;
                        this.is_active = false;
                    };

                    Mover.prototype = {
                        init: function (vector, size) {
                            this.radius = Util.getRandomInt(size, size * 4);
                            this.mass = this.radius / 100;
                            this.position = vector.clone();
                            this.velocity = vector.clone();
                            this.anchor = vector.clone();
                            this.acceleration.set(0, 0);
                            this.a = 1;
                            this.time = 0;
                        },
                        updatePosition: function () {
                            this.position.copy(this.velocity);
                        },
                        updateVelocity: function () {
                            this.velocity.add(this.acceleration);
                            if (this.velocity.distanceTo(this.position) >= 1) {
                                this.direct(this.velocity);
                            }
                        },
                        applyForce: function (vector) {
                            this.acceleration.add(vector);
                        },
                        applyFriction: function () {
                            var friction = Force.friction(
                                this.acceleration,
                                0.1
                            );
                            this.applyForce(friction);
                        },
                        applyDragForce: function () {
                            var drag = Force.drag(this.acceleration, 0.5);
                            this.applyForce(drag);
                        },
                        hook: function () {
                            var force = Force.hook(
                                this.velocity,
                                this.anchor,
                                this.k
                            );
                            this.applyForce(force);
                        },
                        rebound: function (vector, e) {
                            var dot = this.acceleration.clone().dot(vector);
                            this.acceleration.sub(vector.multScalar(2 * dot));
                            this.acceleration.multScalar(e);
                        },
                        direct: function (vector) {
                            var v = vector.clone().sub(this.position);
                            this.direction = Math.atan2(v.y, v.x);
                        },
                        collide: function (target, preserve_impulse) {
                            var distance = this.velocity.distanceTo(
                                target.velocity
                            );
                            var rebound_distance = this.radius + target.radius;
                            var damping = 0.9;

                            if (distance < rebound_distance) {
                                var overlap = Math.abs(
                                    distance - rebound_distance
                                );
                                var this_normal = this.velocity
                                    .clone()
                                    .sub(target.velocity)
                                    .normalize();
                                var target_normal = target.velocity
                                    .clone()
                                    .sub(this.velocity)
                                    .normalize();

                                this.velocity.sub(
                                    target_normal
                                        .clone()
                                        .multScalar(overlap / 2)
                                );
                                target.velocity.sub(
                                    this_normal.clone().multScalar(overlap / 2)
                                );

                                if (preserve_impulse) {
                                    var scalar1 = target.acceleration.length();
                                    var scalar2 = this.acceleration.length();

                                    this.acceleration
                                        .sub(
                                            this_normal.multScalar(scalar1 / -2)
                                        )
                                        .multScalar(damping);
                                    target.acceleration
                                        .sub(
                                            target_normal.multScalar(
                                                scalar2 / -2
                                            )
                                        )
                                        .multScalar(damping);
                                    if (Math.abs(this.acceleration.x) < 1)
                                        this.acceleration.x = 0;
                                    if (Math.abs(this.acceleration.y) < 1)
                                        this.acceleration.y = 0;
                                    if (Math.abs(target.acceleration.x) < 1)
                                        target.acceleration.x = 0;
                                    if (Math.abs(target.acceleration.y) < 1)
                                        target.acceleration.y = 0;
                                }
                            }
                        },
                        collideBorder: function (
                            top,
                            right,
                            bottom,
                            left,
                            preserve_impulse
                        ) {
                            var damping = 0.6;

                            if (
                                top !== false &&
                                this.position.y - this.radius < top
                            ) {
                                var normal = new Vector2(0, 1);
                                this.velocity.y = this.radius;
                                if (preserve_impulse)
                                    this.acceleration.y *= -1 * damping;
                            }
                            if (
                                right !== false &&
                                this.position.x + this.radius > right
                            ) {
                                var normal = new Vector2(-1, 0);
                                this.velocity.x = right - this.radius;
                                if (preserve_impulse)
                                    this.acceleration.x *= -1 * damping;
                            }
                            if (
                                bottom !== false &&
                                this.position.y + this.radius > bottom
                            ) {
                                var normal = new Vector2(0, -1);
                                this.velocity.y = bottom - this.radius;
                                if (preserve_impulse)
                                    this.acceleration.y *= -1 * damping;
                            }
                            if (
                                left !== false &&
                                this.position.x - this.radius < left
                            ) {
                                var normal = new Vector2(1, 0);
                                this.velocity.x = this.radius;
                                if (preserve_impulse)
                                    this.acceleration.x *= -1 * damping;
                            }
                        },
                        draw: function (context) {
                            context.fillStyle =
                                "rgba(" +
                                this.r +
                                "," +
                                this.g +
                                "," +
                                this.b +
                                "," +
                                this.a +
                                ")";
                            context.beginPath();
                            context.arc(
                                this.position.x,
                                this.position.y,
                                this.radius,
                                0,
                                Math.PI / 180,
                                true
                            );
                            context.fill();
                        },
                        activate: function () {
                            this.is_active = true;
                        },
                        inactivate: function () {
                            this.is_active = false;
                        },
                    };

                    return Mover;
                };

                module.exports = exports();
            },
            { "./force": 2, "./util": 5, "./vector2": 6 },
        ],
        5: [
            function (require, module, exports) {
                var exports = {
                    getRandomInt: function (min, max) {
                        return Math.floor(Math.random() * (max - min)) + min;
                    },
                    getDegree: function (radian) {
                        return (radian / Math.PI) * 180;
                    },
                    getRadian: function (degrees) {
                        return (degrees * Math.PI) / 180;
                    },
                    getSpherical: function (rad1, rad2, r) {
                        var x = Math.cos(rad1) * Math.cos(rad2) * r;
                        var z = Math.cos(rad1) * Math.sin(rad2) * r;
                        var y = Math.sin(rad1) * r;
                        return [x, y, z];
                    },
                };

                module.exports = exports;
            },
            {},
        ],
        6: [
            function (require, module, exports) {
                //
                // このVector2クラスは、three.jsのTHREE.Vector2クラスの計算式の一部を利用しています。
                // https://github.com/mrdoob/three.js/blob/master/src/math/Vector2.js#L367
                //

                var exports = function () {
                    var Vector2 = function (x, y) {
                        this.x = x || 0;
                        this.y = y || 0;
                    };

                    Vector2.prototype = {
                        set: function (x, y) {
                            this.x = x;
                            this.y = y;
                            return this;
                        },
                        copy: function (v) {
                            this.x = v.x;
                            this.y = v.y;
                            return this;
                        },
                        add: function (v) {
                            this.x += v.x;
                            this.y += v.y;
                            return this;
                        },
                        addScalar: function (s) {
                            this.x += s;
                            this.y += s;
                            return this;
                        },
                        sub: function (v) {
                            this.x -= v.x;
                            this.y -= v.y;
                            return this;
                        },
                        subScalar: function (s) {
                            this.x -= s;
                            this.y -= s;
                            return this;
                        },
                        mult: function (v) {
                            this.x *= v.x;
                            this.y *= v.y;
                            return this;
                        },
                        multScalar: function (s) {
                            this.x *= s;
                            this.y *= s;
                            return this;
                        },
                        div: function (v) {
                            this.x /= v.x;
                            this.y /= v.y;
                            return this;
                        },
                        divScalar: function (s) {
                            this.x /= s;
                            this.y /= s;
                            return this;
                        },
                        min: function (v) {
                            if (this.x < v.x) this.x = v.x;
                            if (this.y < v.y) this.y = v.y;
                            return this;
                        },
                        max: function (v) {
                            if (this.x > v.x) this.x = v.x;
                            if (this.y > v.y) this.y = v.y;
                            return this;
                        },
                        clamp: function (v_min, v_max) {
                            if (this.x < v_min.x) {
                                this.x = v_min.x;
                            } else if (this.x > v_max.x) {
                                this.x = v_max.x;
                            }
                            if (this.y < v_min.y) {
                                this.y = v_min.y;
                            } else if (this.y > v_max.y) {
                                this.y = v_max.y;
                            }
                            return this;
                        },
                        floor: function () {
                            this.x = Math.floor(this.x);
                            this.y = Math.floor(this.y);
                            return this;
                        },
                        ceil: function () {
                            this.x = Math.ceil(this.x);
                            this.y = Math.ceil(this.y);
                            return this;
                        },
                        round: function () {
                            this.x = Math.round(this.x);
                            this.y = Math.round(this.y);
                            return this;
                        },
                        roundToZero: function () {
                            this.x =
                                this.x < 0
                                    ? Math.ceil(this.x)
                                    : Math.floor(this.x);
                            this.y =
                                this.y < 0
                                    ? Math.ceil(this.y)
                                    : Math.floor(this.y);
                            return this;
                        },
                        negate: function () {
                            this.x = -this.x;
                            this.y = -this.y;
                            return this;
                        },
                        dot: function (v) {
                            return this.x * v.x + this.y * v.y;
                        },
                        lengthSq: function () {
                            return this.x * this.x + this.y * this.y;
                        },
                        length: function () {
                            return Math.sqrt(this.lengthSq());
                        },
                        normalize: function () {
                            return this.divScalar(this.length());
                        },
                        distanceTo: function (v) {
                            var dx = this.x - v.x;
                            var dy = this.y - v.y;
                            return Math.sqrt(dx * dx + dy * dy);
                        },
                        setLength: function (l) {
                            var oldLength = this.length();
                            if (oldLength !== 0 && l !== oldLength) {
                                this.multScalar(l / oldLength);
                            }
                            return this;
                        },
                        clone: function () {
                            return new Vector2(this.x, this.y);
                        },
                    };

                    return Vector2;
                };

                module.exports = exports();
            },
            {},
        ],
    },
    {},
    [3]
);
