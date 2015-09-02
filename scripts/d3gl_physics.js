(function() {
  var DC = DiabloCalc;

  function makeBasis(/*in*/ x, /*out*/ y, /*out*/ z) {
    var xx = x[0], xy = x[1], xz = x[2];
    if (Math.abs(xx) > Math.abs(xy)) {
      // y <- (0,1,0)
      var s = 1.0 / Math.sqrt(xx * xx + xz * xz);
      z[0] = xz * s;
      z[1] = 0;
      z[2] = -xx * s;
      y[0] = xy * z[2];
      y[1] = xz * z[0] - xx * z[2];
      y[2] = -xy * z[0];
    } else {
      // y <- (1,0,0)
      var s = 1.0 / Math.sqrt(xy * xy + xz * xz);
      z[0] = 0;
      z[1] = -xz * s;
      z[2] = xy * s;
      y[0] = xy * z[2] - xz * z[1];
      y[1] = -xx * z[2];
      y[2] = xx * z[1];
    }
  }

  function adjustQuat(q, v, t) {
    var qx = q[0], qy = q[1], qz = q[2], qw = q[3], vx = v[0] * t * 0.5, vy = v[1] * t * 0.5, vz = v[2] * t * 0.5;
    q[0] += qw * vx + qz * vy - qy * vz;
    q[1] += qx * vz + qw * vy - qz * vx;
    q[2] += qy * vx - qx * vy + qw * vz;
    q[3] -= qx * vx + qy * vy + qz * vz;
    quat.normalize(q, q);
  }
  function inverseMat4(out, a, m) {
    var x = a[0] - m[12], y = a[1] - m[13], z = a[2] - m[14];
    out[0] = m[0] * x + m[1] * y + m[2] * z;
    out[1] = m[4] * x + m[5] * y + m[6] * z;
    out[2] = m[8] * x + m[9] * y + m[10] * z;
    return out;
  }
  function mat4add(dst, src) {
    dst[0] += src[0]; dst[1] += src[1]; dst[2] += src[2];
    dst[3] += src[3]; dst[4] += src[4]; dst[5] += src[5];
    dst[6] += src[6]; dst[7] += src[7]; dst[8] += src[8];
  }

  var ClosestSegmentSegment = (function() {
    // http://www.geometrictools.com/GTEngine/Include/GteDistSegmentSegment.h
    var P1mP0 = vec3.create(), Q1mQ0 = vec3.create(), P0mQ0 = vec3.create(),
        result = [vec3.create(), vec3.create()];

    function getClampedRoot(slope, h0, h1) {
      if (h0 > -1e-6) return 0;
      if (h1 < 1e-6) return 1;
      var r = -h0 / slope;
      if (r > 1) r = 0.5;
      return r;
    }

    return function(p0, p1, q0, q1) {
      var a, b, c, d, e, f, f00, f10, f01, f11, g00, g10, g01, g11, t0, t1,
        s0, s1, c0, c1, edge0, edge1, e00, e01, e10, e11, delta, h0, h1, z, omz;
      vec3.subtract(P1mP0, p1, p0);
      vec3.subtract(Q1mQ0, q1, q0);
      vec3.subtract(P0mQ0, p0, q0);
      a = vec3.dot(P1mP0, P1mP0);
      b = vec3.dot(P1mP0, Q1mQ0);
      c = vec3.dot(Q1mQ0, Q1mQ0);
      d = vec3.dot(P1mP0, P0mQ0);
      e = vec3.dot(Q1mQ0, P0mQ0);
      f00 = d; f10 = f00 + a; f01 = f00 - b; f11 = f10 - b;
      g00 = -e; g10 = g00 - b; g01 = g00 + c; g11 = g10 + c;

      if (a > 1e-6 && c > 1e-6) {
        s0 = getClampedRoot(a, f00, f10);
        s1 = getClampedRoot(a, f01, f11);
        c0 = (s0 < 1e-6 ? -1 : (s0 > 1-1e-6 ? 1 : 0));
        c1 = (s1 < 1e-6 ? -1 : (s1 > 1-1e-6 ? 1 : 0));
        if (c0 == -1 && c1 == -1) {
          t0 = 0; t1 = getClampedRoot(c, g00, g01);
        } else if (c0 == 1 && c1 == 1) {
          t0 = 1; t1 = getClampedRoot(c, g10, g11);
        } else {
          if (c0 < 0) {
            edge0 = 0; e00 = 0; e01 = f00 / b;
            if (e01 < 0 || e01 > 1) e01 = 0.5;
          } else if (c0 == 0) {
            edge0 = 2; e00 = s0; e01 = 0;
          } else {
            edge0 = 1; e00 = 1; e01 = f10 / b;
            if (e01 < 0 || e01 > 1) e01 = 0.5;
          }
          if (c1 < 0) {
            edge1 = 0; e10 = 0; e11 = f00 / b;
            if (e11 < 0 || e11 > 1) e11 = 0.5;
          } else if (c1 == 0) {
            edge1 = 3; e10 = s1; e11 = 1;
          } else {
            edge1 = 1; e10 = 1; e11 = f10 / b;
            if (e11 < 0 || e11 > 1) e11 = 0.5;
          }
          delta = e11 - e01;
          h0 = delta * (c * e01 - b * e00 - e);
          if (h0 > -1e-6) {
            if (edge0 == 0) {
              t0 = 0; t1 = getClampedRoot(c, g00, g01);
            } else if (edge0 == 1) {
              t0 = 1; t1 = getClampedRoot(c, g10, g11);
            } else {
              t0 = e00; t1 = e01;
            }
          } else {
            h1 = delta * (c * e11 - b * e10 - e);
            if (h1 < 1e-6) {
              if (edge1 == 0) {
                t0 = 0; t1 = getClampedRoot(c, g00, g01);
              } else if (edge1 == 1) {
                t0 = 1; t1 = getClampedRoot(c, g10, g11);
              } else {
                t0 = e10; t1 = e11;
              }
            } else {
              z = Math.min(Math.max(h0 / (h0 - h1), 0), 1); omz = 1 - z;
              t0 = omz * e00 + z * e10;
              t1 = omz * e01 + z * e11;
            }
          }
        }
      } else {
        if (a > 1e-6) {
          t0 = getClampedRoot(a, f00, f10); t1 = 0;
        } else if (c > 1e-6) {
          t0 = 0; t1 = getClampedRoot(c, g00, g01);
        } else {
          t0 = 0; t1 = 0;
        }
      }
      vec3.lerp(result[0], p0, p1, t0);
      vec3.lerp(result[1], q0, q1, t1);
      return result;
    };
  })();

  function CollisionPlane(normal, offset) {
    this.normal = normal;
    this.offset = offset;
    this.friction = 1;
  }
  CollisionPlane.prototype.update = function() {};
  function CollisionSphere(body, center, radius) {
    this.body = body;
    this.localCenter = center;
    this.radius = radius;
    this.center = vec3.clone(center);
    this.friction = 1;
  }
  CollisionSphere.prototype.update = function() {
    if (this.body) vec3.transformMat4(this.center, this.localCenter, this.body.transform);
  };
  function CollisionCapsule(body, start, end, radius) {
    this.body = body;
    this.localStart = start;
    this.localEnd = end;
    this.radius = radius;
    this.start = vec3.clone(start);
    this.end = vec3.clone(end);
    this.friction = 1;
  }
  CollisionCapsule.prototype.update = function() {
    if (this.body) {
      vec3.transformMat4(this.start, this.localStart, this.body.transform);
      vec3.transformMat4(this.end, this.localEnd, this.body.transform);
    }
  };

  function RigidBody(bone, moves) {
    this.name = bone.name;
    if (bone.capsule) {
      this.center = vec3.lerp(vec3.create(), bone.capsule.start, bone.capsule.end, 0.5);
      var r2 = bone.capsule.radius;
      var ht = vec3.distance(bone.capsule.start, bone.capsule.end);
      var cM = Math.PI * ht * r2;
      var hsM = Math.PI * 2 * r2 * bone.capsule.radius / 3;
      var i22 = r2 * cM * 0.5;
      var i11 = i22 * 0.5 + cM * ht * ht / 12;
      var i33 = i11;
      var t0 = hsM * r2 * 0.4;
      i22 += t0 * 2;
      var t1 = ht * 0.5;
      var t2 = t0 + hsM * (t1 * t1 + 3 * ht * bone.capsule.radius / 8);
      i11 += t2 * 2;
      i33 += t2 * 2;
      this.mass = cM + 2 * hsM;

      var orient = mat3.create();
      var vX = orient.subarray(0, 3), vY = orient.subarray(3, 6), vZ = orient.subarray(6, 9);
      vec3.subtract(vY, bone.capsule.end, bone.capsule.start);
      vec3.scale(vY, vY, 1 / ht);
      makeBasis(vY, vX, vZ);
      this.localInvInertia = mat3.clone(orient);
      var inv11 = 1 / i11, inv22 = 1 / i22, inv33 = 1 / i33;
      var lii = this.localInvInertia;
      lii[0] *= inv11; lii[1] *= inv11; lii[2] *= inv11;
      lii[3] *= inv22; lii[4] *= inv22; lii[5] *= inv22;
      lii[6] *= inv33; lii[7] *= inv33; lii[8] *= inv33;
      mat3.multiply(lii, lii, mat3.transpose(orient, orient));

      this.shape = new CollisionCapsule(this, bone.capsule.start, bone.capsule.end, bone.capsule.radius);
    } else {
      this.center = vec3.create();
      this.mass = 1;
      this.localInvInertia = mat3.create();
    }
    this.moves = moves;
    if (!this.moves) {
      this.localInvInertia.set([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    this.invMass = (moves ? 1.0 / this.mass : 0);

    this.transform = bone.localTransform;
    if (!this.moves) {
      this.prevTransform = mat4.clone(this.transform);
    }
    this.position = vec3.transformMat4(vec3.create(), this.center, this.transform);
    this.orientation = quat.fromMat3(quat.create(), mat3.fromMat4(mat3.create(), this.transform));
    quat.normalize(this.orientation, this.orientation);

    this.velocity = vec3.create();
    this.angMomentum = vec3.create();
    this.angVelocity = vec3.create();
    this.invInertia = mat3.create();
    this.acceleration = vec3.create();

    this.forceAccum = vec3.create();
    this.torqueAccum = vec3.create();

    this.gravity = vec3.fromValues(0, 0, -25);
    this.linDamping = 0.25;
    this.angDamping = 0.2;
  }
  RigidBody.prototype = {
    setTransform: function(transform, elapsed) {
      if (elapsed > 1e-6) {
        mat4.copy(this.prevTransform, this.transform);
        this.invTime = 1 / elapsed;
      }
      mat4.copy(this.transform, transform);
      this.position = vec3.transformMat4(vec3.create(), this.center, transform);
      this.orientation = quat.fromMat3(quat.create(), mat3.fromMat4(mat3.create(), transform));
      quat.normalize(this.orientation, this.orientation);
      this.calculateInertia();
    },
    getShapes: function(shapes) {
      if (this.shape) {
        this.shape.update();
        shapes.push(this.shape);
      }
    },

    addForce: function(force) {
      vec3.add(this.forceAccum, this.forceAccum, force);
    },
    addForceAt: (function() {
      var tmp = vec3.create();
      return function(force, pos) {
        var relPos = vec3.subtract(tmp, pos, this.position);
        vec3.cross(relPos, relPos, force);
        vec3.add(this.forceAccum, this.forceAccum, force);
        vec3.add(this.torqueAccum, this.torqueAccum, relPos);
      };
    })(),
    addImpulse: function(impulse) {
      vec3.scaleAndAdd(this.velocity, this.velocity, impulse, this.invMass);
    },
    addImpulseAt: (function() {
      var tmp = vec3.create();
      return function(impulse, pos) {
        var relPos = vec3.subtract(tmp, pos, this.position);
        vec3.cross(relPos, relPos, impulse);
        vec3.scaleAndAdd(this.velocity, this.velocity, impulse, this.invMass);
        vec3.add(this.angMomentum, this.angMomentum, relPos);
        vec3.transformMat3(this.angVelocity, this.angMomentum, this.invInertia);
      };
    })(),
    localToWorld: function(dst, pos) {
      return vec3.transformMat4(dst, pos, this.transform);
    },
    addForceAtLocal: function(force, pos) {
      this.addForceAt(force, this.localToWorld(vec3.create(), pos));
    },
    addImpulseAtLocal: function(impulse, pos) {
      this.addImpulseAt(impulse, this.localToWorld(vec3.create(), pos));
    },
    velocityAt: function(out, pos) {
      if (this.moves) {
        var res = vec3.subtract(out, pos, this.position);
        vec3.cross(res, this.angVelocity, res);
        return vec3.add(res, res, this.velocity);
      } else if (this.invTime) {
        var pos1 = inverseMat4(out, pos, this.transform);
        vec3.transformMat4(pos1, pos1, this.prevTransform);
        vec3.subtract(pos1, pos, pos1);
        vec3.scale(pos1, pos1, this.invTime);
        var len = vec3.length(pos1);
        if (len > 2) vec3.scale(pos1, pos1, 2 / len);
        return pos1;
      } else {
        return vec3.set(out, 0, 0, 0);
      }
    },
    move: function(deltaPos, deltaRot) {
      if (this.moves) {
        vec3.add(this.position, this.position, deltaPos);
        adjustQuat(this.orientation, deltaRot, 1);
        //this.calculateDerived();
/*        mat4.fromQuat(this.transform, this.orientation);
        var trCenter = vec3.transformMat4(vec3.create(), this.center, this.transform);
        vec3.subtract(trCenter, this.position, trCenter);
        this.transform[12] = trCenter[0];
        this.transform[13] = trCenter[1];
        this.transform[14] = trCenter[2];
        this.calculateInertia();*/
      }
    },
    
    startFrame: function(elapsed) {
      vec3.scaleAndAdd(this.forceAccum, this.forceAccum, this.gravity, this.mass);
      vec3.scale(this.acceleration, this.forceAccum, this.invMass * elapsed);
      vec3.add(this.velocity, this.velocity, this.acceleration);
      vec3.scale(this.velocity, this.velocity, Math.pow(this.linDamping, elapsed));
      vec3.scaleAndAdd(this.angMomentum, this.angMomentum, this.torqueAccum, elapsed);
      vec3.scale(this.angMomentum, this.angMomentum, Math.pow(this.angDamping, elapsed));
      vec3.transformMat3(this.angVelocity, this.angMomentum, this.invInertia);
      vec3.set(this.forceAccum, 0, 0, 0);
      vec3.set(this.torqueAccum, 0, 0, 0);
    },
    calculateInertia: function() {
      mat3.fromQuat(this.invInertia, this.orientation);
      var temp = mat3.transpose(mat3.create(), this.invInertia);
      mat3.multiply(this.invInertia, this.invInertia, this.localInvInertia);
      mat3.multiply(this.invInertia, this.invInertia, temp);
    },
    calculateDerived: function() {
      if (this.moves) {
        mat4.fromQuat(this.transform, this.orientation);
        var trCenter = vec3.transformMat4(vec3.create(), this.center, this.transform);
        vec3.subtract(trCenter, this.position, trCenter);
        this.transform[12] = trCenter[0];
        this.transform[13] = trCenter[1];
        this.transform[14] = trCenter[2];
        this.calculateInertia();
      }
    },
    integrate: function(elapsed) {
      if (!this.moves) return;

      vec3.scaleAndAdd(this.position, this.position, this.velocity, elapsed);
      adjustQuat(this.orientation, this.angVelocity, elapsed);

      this.calculateDerived();
    },
  };

  function Contact(body1, body2, pos1, pos2, normal, restitution, friction) {
    this.body1 = body1;
    this.body2 = body2;
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.normal = normal;
    this.restitution = (restitution || 0);
    this.friction = (friction || 0);
    this.velocity = vec3.create();
    this.calculateVelocity();
    this.calculatePenetration();
  }
  function PointContact(body1, body2, pos1, pos2) {
    this.body1 = body1;
    this.body2 = body2;
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.velocity = vec3.create();
    this.normal = vec3.create();
    this.calculateVelocity();
    this.calculatePenetration();
  }
  PointContact.prototype.reset = function() {
    this.calculateVelocity();
    this.calculatePenetration();
  };
  (function() {
    var tmp1 = new Float32Array(3), tmp2 = new Float32Array(3),
      rel1 = new Float32Array(3), rel2 = new Float32Array(3),
      cmp1 = new Float32Array(3), cmp2 = new Float32Array(3),
      uim1 = new Float32Array(9), uim2 = new Float32Array(9);
    Contact.prototype.calculateVelocity = function() {
      this.body1.velocityAt(this.velocity, this.pos1);
      if (this.body2) vec3.subtract(this.velocity, this.velocity, this.body2.velocityAt(tmp1, this.pos2));
      var fromAccel = vec3.dot(this.body1.acceleration, this.normal);
      if (this.body2) fromAccel -= vec3.dot(this.body2.acceleration, this.normal);
      this.deltaVelocity = -vec3.dot(this.velocity, this.normal) * (this.restitution + 1);
      if (this.fromAccel < 0) this.deltaVelocity += fromAccel * this.restitution;
    };
    PointContact.prototype.calculateVelocity = function() {
      this.body1.velocityAt(this.velocity, this.pos1);
      vec3.subtract(this.velocity, this.velocity, this.body2.velocityAt(tmp1, this.pos2));
      this.deltaVelocity = vec3.length(this.velocity);
    };
    Contact.prototype.calculatePenetration = function() {
      this.penetration = vec3.dot(this.normal, vec3.subtract(tmp1, this.pos2, this.pos1));
    };
    PointContact.prototype.calculatePenetration = function() {
      this.penetration = vec3.length(vec3.subtract(this.normal, this.pos2, this.pos1));
      if (this.penetration > 1e-6) vec3.scale(this.normal, this.normal, 1 / this.penetration);
    };
    function unitImpulseMatrix(mat, body, point) {
      var iit = body.invInertia, im = body.invMass;
      var x = point[0] - body.position[0],
          y = point[1] - body.position[1],
          z = point[2] - body.position[2];
      var m00 = iit[0], m01 = iit[1], m02 = iit[2],
          m10 = iit[3], m11 = iit[4], m12 = iit[5],
          m20 = iit[6], m21 = iit[7], m22 = iit[8];
      var t00 = z * m10 - y * m20, t01 = z * m11 - y * m21, t02 = z * m12 - y * m22,
          t10 = x * m20 - z * m00, t11 = x * m21 - z * m01, t12 = x * m22 - z * m02,
          t20 = y * m00 - x * m10, t21 = y * m01 - x * m11, t22 = y * m02 - x * m12;
      mat[0] = t01 * z - t02 * y + im; mat[1] = t02 * x - t00 * z; mat[2] = t00 * y - t01 * x;
      mat[3] = t11 * z - t12 * y; mat[4] = t12 * x - t10 * z + im; mat[5] = t10 * y - t11 * x;
      mat[6] = t21 * z - t22 * y; mat[7] = t22 * x - t20 * z; mat[8] = t20 * y - t21 * x + im;
    }
    Contact.prototype.resolveVelocity = function() {
      if (!this.friction) {
        vec3.subtract(rel1, this.pos1, this.body1.position);
        vec3.cross(tmp1, rel1, this.normal);
        vec3.transformMat3(cmp1, tmp1, this.body1.invInertia);
        var total = vec3.dot(tmp1, cmp1) + this.body1.invMass;

        if (this.body2) {
          vec3.subtract(rel2, this.pos2, this.body2.position);
          vec3.cross(tmp1, rel2, this.normal);
          vec3.transformMat3(cmp2, tmp1, this.body2.invInertia);
          total += vec3.dot(tmp1, cmp2) + this.body2.invMass;
        }

        total = 1 / total;
        vec3.scale(tmp1, this.normal, this.deltaVelocity * total);
      } else {
        unitImpulseMatrix(uim1, this.body1, this.pos1);
        if (this.body2) {
          unitImpulseMatrix(uim2, this.body2, this.pos2);
          mat4add(uim1, uim2);
        }
        mat3.invert(uim2, uim1);
        // uim1: impulse -> velocity
        // uim2: velocity -> impulse
        
        vec3.negate(cmp1, this.velocity);
        vec3.scaleAndAdd(cmp1, cmp1, this.normal, vec3.dot(this.normal, this.velocity));
        // cmp1 = planar velocity
        vec3.scaleAndAdd(tmp1, cmp1, this.normal, this.deltaVelocity);
        // tmp1 = desired change in velocity
        vec3.transformMat3(tmp1, tmp1, uim2);
        // tmp1 = candidate impulse
        var response = vec3.dot(tmp1, this.normal);
        vec3.scaleAndAdd(tmp2, tmp1, this.normal, -response);
        // tmp2 = planar impulse
        var planar = vec3.length(tmp2);
        if (planar > response * this.friction) {
          vec3.normalize(cmp1, cmp1);
          vec3.scaleAndAdd(tmp1, this.normal, cmp1, this.friction);
          vec3.transformMat3(tmp2, tmp1, uim1);
          var factor = vec3.dot(tmp2, this.normal);
          if (Math.abs(factor) < 1e-4) return; // oops
          vec3.scale(tmp1, tmp1, this.deltaVelocity / factor);
        }
      }

      this.body1.addImpulseAt(tmp1, this.pos1);
      if (this.body2) {
        vec3.negate(tmp1, tmp1);
        this.body2.addImpulseAt(tmp1, this.pos2);
      }
    };
    PointContact.prototype.resolveVelocity = function() {
      unitImpulseMatrix(uim1, this.body1, this.pos1);
      unitImpulseMatrix(uim2, this.body2, this.pos2);
      mat4add(uim1, uim2);
      mat3.invert(uim1, uim1);
      vec3.transformMat3(tmp1, this.velocity, uim1);
      this.body2.addImpulseAt(tmp1, this.pos2);
      vec3.negate(tmp1, tmp1);
      this.body1.addImpulseAt(tmp1, this.pos1);
    };
    function updateBodyPosition(body, rel, normal, cmp, linFactor, angFactor, factor, outpos, outrot) {
      var linMove = linFactor * factor;
      var angMove = angFactor * factor;
      vec3.scaleAndAdd(tmp1, rel, normal, -vec3.dot(rel, normal));
      var maxMove = 0.2 * vec3.length(tmp1);
      if (angMove < -maxMove) {
        linMove += angMove + maxMove;
        angMove = -maxMove;
      } else if (angMove > maxMove) {
        linMove += angMove - maxMove;
        angMove = maxMove;
      }
      vec3.scale(outpos, normal, linMove);
      if (angFactor > 1e-4) {
        vec3.scale(outrot, cmp, angMove / angFactor);
      } else {
        vec3.set(outrot, 0, 0, 0);
      }
    }
    Contact.prototype.resolvePosition = function(info) {
      vec3.subtract(rel1, this.pos1, this.body1.position);
      vec3.cross(tmp1, rel1, this.normal);
      vec3.transformMat3(cmp1, tmp1, this.body1.invInertia);
      var lin1 = vec3.dot(tmp1, cmp1), ang1 = this.body1.invMass;

      var lin2 = 0, ang2 = 0;
      if (this.body2) {
        vec3.subtract(rel2, this.pos2, this.body2.position);
        vec3.cross(tmp1, rel2, this.normal);
        vec3.transformMat3(cmp2, tmp1, this.body2.invInertia);
        lin2 = vec3.dot(tmp1, cmp2), ang2 = this.body2.invMass;
      }

      var total = lin1 + ang1 + lin2 + ang2;
      if (total < 1e-4) return false;
      total = this.penetration / total;
      updateBodyPosition(this.body1, rel1, this.normal, cmp1, lin1, ang1, total, info.pos1, info.rot1);
      if (this.body2) updateBodyPosition(this.body2, rel2, this.normal, cmp2, lin2, ang2, -total, info.pos2, info.rot2);
    };
    PointContact.prototype.resolvePosition = Contact.prototype.resolvePosition;
/*    PointContact.prototype.resolvePosition = function(info) {
      this.normal = vec3.subtract(tmp1, this.pos2, this.pos1);
      vec3.scale(tmp1, tmp1, 1 / this.penetration);
      var mass1 = (this.lock1 ? 0 : this.body1.invMass);
      var mass2 = (!this.body2 || this.lock2 ? 0 : this.body2.invMass);
      var total = mass1 + mass2;
      if (total < 1e-4) return false;
      total = this.penetration / total;
      vec3.scale(info.pos1, tmp1, mass1 * total),
      vec3.scale(info.pos2, tmp1, -mass2 * total),
      vec3.set(info.rot1, 0, 0, 0);
      vec3.set(info.rot2, 0, 0, 0);
      this.body1.move(info.pos1);
      if (this.body2) this.body2.move(info.pos2);
    };*/
  })();

  function ResolveContacts(contacts) {
    for (var iter = Math.max(contacts.length * 2, 10); iter--;) {
      var contact = null;
      var bestVelocity = 1e-4;
      for (var i = 0; i < contacts.length; ++i) {
        if (contacts[i].deltaVelocity > bestVelocity) {
          contact = contacts[i];
          bestVelocity = contact.deltaVelocity;
        }
      }
      if (!contact) break;

      contact.resolveVelocity();
      for (var i = 0; i < contacts.length; ++i) {
        var other = contacts[i];
        if (other.body1 == contact.body1 || other.body1 == contact.body2 ||
            other.body2 == contact.body1 || other.body2 == contact.body1) {
          other.calculateVelocity();
        }
      }
    }
    var info = {
      pos1: vec3.create(),
      pos2: vec3.create(),
      rot1: vec3.create(),
      rot2: vec3.create(),
    };
    var tmpvec = vec3.create();
    function adjustPosition(body, pos, deltaPos, deltaRot) {
      vec3.subtract(tmpvec, pos, body.position);
      vec3.cross(tmpvec, deltaRot, tmpvec);
      vec3.add(pos, pos, deltaPos);
      vec3.add(pos, pos, tmpvec);
    }
    for (var iter = Math.max(contacts.length * 2, 10); iter--;) {
      var contact = null;
      var bestPenetration = 1e-4;
      for (var i = 0; i < contacts.length; ++i) {
        if (contacts[i].penetration > bestPenetration) {
          contact = contacts[i];
          bestPenetration = contact.penetration;
        }
      }
      if (!contact) break;

      if (contact.resolvePosition(info) === false) continue;

      for (var i = 0; i < contacts.length; ++i) {
        var other = contacts[i];
        if (other.body1 == contact.body1 || other.body2 == contact.body1) {
          adjustPosition(contact.body1, (other.body1 == contact.body1 ? other.pos1 : other.pos2),
            info.pos1, info.rot1);
          other.calculatePenetration();
        }
        if (contact.body2 && (other.body1 == contact.body2 || other.body2 == contact.body2)) {
          adjustPosition(contact.body2, (other.body1 == contact.body2 ? other.pos1 : other.pos2),
            info.pos2, info.rot2);
          other.calculatePenetration();
        }
      }

      contact.body1.move(info.pos1, info.rot1);
      if (contact.body2) contact.body2.move(info.pos2, info.rot2);
    }
  }

  function CapsuleCapsuleCollision(body1, body2, a0, b0, r0, a1, b1, r1) {
    var closest = ClosestSegmentSegment(a0, b0, a1, b1);
    var normal = vec3.subtract(vec3.create(), closest[0], closest[1]);
    var dist = vec3.length(normal);
    if (dist > r0 + r1 + 1e-4) return;
    if (dist > 1e-4) {
      vec3.scale(normal, normal, 1 / dist);
    } else {
      vec3.set(normal, 1, 0, 0);
    }
    return new Contact(body1, body2,
      vec3.scaleAndAdd(vec3.create(), closest[0], normal, -r0),
      vec3.scaleAndAdd(vec3.create(), closest[1], normal, r1), normal);
  }
  function GenerateCollisions(shapes, contacts, delta) {
    for (var i = 0; i < shapes.length; ++i) {
      for (var j = i + 1; j < shapes.length; ++j) {
        var sh1 = shapes[i];
        var sh2 = shapes[j];
        if ((!sh1.body || !sh2.body.moves) && (!sh2.body && !sh2.body.moves)) continue;
        if (sh1.body === sh2.body) continue;
        if (sh1.body && sh2.body && (sh1.body.parent === sh2.body || sh2.body.parent === sh1.body)) continue;
        if (sh1.body && sh2.body && sh1.body.parent === sh2.body.parent) continue;

        if (sh2 instanceof CollisionPlane) {
          var tmp = sh1;
          sh1 = sh2;
          sh2 = tmp;
        }
        var contact = undefined;
        if (sh1 instanceof CollisionPlane) {
          if (sh2 instanceof CollisionSphere) {
            var dist = vec3.dot(sh1.normal, sh2.center) - sh1.offset;
            if (dist < sh2.radius + 1e-4) {
              contact = new Contact(sh2.body, sh1.body,
                vec3.scaleAndAdd(vec3.create(), sh2.center, sh1.normal, -sh2.radius),
                vec3.scaleAndAdd(vec3.create(), sh2.center, sh1.normal, -dist),
                sh1.normal);
            }
          } else if (sh2 instanceof CollisionCapsule) {
            var dist1 = vec3.dot(sh1.normal, sh2.start) - sh1.offset;
            var dist2 = vec3.dot(sh1.normal, sh2.end) - sh1.offset;
            if (dist1 < sh2.radius + delta) {
              contact = new Contact(sh2.body, sh1.body,
                vec3.scaleAndAdd(vec3.create(), sh2.start, sh1.normal, -sh2.radius),
                vec3.scaleAndAdd(vec3.create(), sh2.start, sh1.normal, -dist1),
                sh1.normal);
              contact.friction = (sh1.friction || 1) * (sh2.friction || 1);
              contact.restitution = 0.3;
              contacts.push(contact);
            }
            if (dist2 < sh2.radius + delta) {
              contact = new Contact(sh2.body, sh1.body,
                vec3.scaleAndAdd(vec3.create(), sh2.end, sh1.normal, -sh2.radius),
                vec3.scaleAndAdd(vec3.create(), sh2.end, sh1.normal, -dist2),
                sh1.normal);
              contact.friction = (sh1.friction || 1) * (sh2.friction || 1);
              contact.restitution = 0.3;
              contacts.push(contact);
            }
            contact = undefined;
          }
        } else {
          if (sh2 instanceof CollisionCapsule) {
            var tmp = sh1;
            sh1 = sh2;
            sh2 = tmp;
          }
          if (sh1 instanceof CollisionCapsule) {
            if (sh2 instanceof CollisionCapsule) {
              contact = CapsuleCapsuleCollision(sh1.body, sh2.body,
                sh1.start, sh1.end, sh1.radius, sh2.start, sh2.end, sh2.radius);
            } else if (sh2 instanceof CollisionSphere) {
              contact = CapsuleCapsuleCollision(sh1.body, sh2.body,
                sh1.start, sh1.end, sh1.radius, sh2.center, sh2.center, sh2.radius);
            }
          } else if (sh1 instanceof CollisionSphere) {
            if (sh2 instanceof CollisionSphere) {
              contact = CapsuleCapsuleCollision(sh1.body, sh2.body,
                sh1.center, sh1.center, sh1.radius, sh2.center, sh2.center, sh2.radius);
            }
          }
        }
        if (contact) {
          contact.friction = (sh1.friction || 1) * (sh2.friction || 1);
          contact.restitution = 0.3;
          contacts.push(contact);
        }
      }
    }
  }

  function SpringConstraint(body1, body2, pos1, pos2, restLength, stiffness) {
    this.body1 = body1;
    this.body2 = body2;
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.restLength = restLength;
    this.stiffness = stiffness;
  };
  (function() {
    var tmp1 = vec3.create(), tmp2 = vec3.create(), tmp3 = vec3.create();
    SpringConstraint.prototype.resolve = function(elapsed, contacts) {
      var pos1 = this.body1.localToWorld(tmp1, this.pos1);
      var pos2 = this.body2.localToWorld(tmp2, this.pos2);
      var delta = vec3.subtract(tmp3, pos2, pos1);
      var distance = vec3.length(delta);
      if (distance > 1e-4) {
        vec3.scale(delta, delta, (this.restLength - distance) * this.stiffness / distance);
      } else {
        vec3.set(delta, (this.restLength - distance) * this.stiffness, 0, 0);
      }
      this.body2.addForceAt(delta, pos2);
      vec3.negate(delta, delta);
      this.body1.addForceAt(delta, pos1);
    };
  })();

  function PointJoint(body1, body2, pos1, pos2) {
    this.body1 = body1;
    this.body2 = body2;
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.contact = new PointContact(this.body1, this.body2, vec3.create(), vec3.create());
  };
  PointJoint.prototype.resolve = function(elapsed, contacts, extra) {
    this.body1.localToWorld(this.contact.pos1, this.pos1);
    this.body2.localToWorld(this.contact.pos2, this.pos2);
    var dist = vec3.squaredDistance(this.contact.pos1, this.contact.pos2);
    if (dist < 1e-7) return;
    this.contact.reset();
    contacts.push(this.contact);
  };

  function D3Ragdoll(gl) {
    this.gl = gl;
  }
  D3Ragdoll.prototype.init = function(model, transform) {
    if (model.boneList) {
      if (!model.animated) {
        for (var i = 0; i < model.boneList.length; ++i) {
          var bone = model.boneList[i];
          mat4.multiply(bone.localTransform, transform, bone.localTransform);
        }
        model.animated = true;
      }
      this.bodies = [];
      this.constraints = [];
      for (var i = 0; i < model.boneList.length; ++i) {
        var bone = model.boneList[i];
        bone.body = new RigidBody(bone, !!bone.parent);
        if (bone.parent) bone.body.parent = bone.parent.body;
        this.bodies.push(bone.body);
        if (bone.parent && bone.constraint) {
          this.constraints.push(new PointJoint(bone.parent.body, bone.body,
            bone.constraint.parent.translate, bone.constraint.local.translate));
        }
      }
    }
  };
  D3Ragdoll.prototype.update = function(model, time, transform) {
    if (!this.bodies) {
      this.init(model, transform);
    }
    if (!this.bodies) return;
    if (this.time === undefined) this.time = time;

    var groundPos = vec3.create();
    vec3.transformMat4(groundPos, groundPos, DC.d3gl.mvMatrix);
    var ground = new CollisionPlane(vec3.fromValues(0, 0, 1), groundPos[2]);
    ground.friction = 3;

    this.bodies[0].setTransform(transform, time - this.time);
    var delta = Math.min(time - this.time, 0.5);
    if (this.time < time - 0.5) this.time = time - 0.5;
    var step = 1 / 60;
    while (this.time < time - step) {
      this.time += step;

      var shapes = [ground];
      var contacts = [];

      for (var i = 0; i < this.bodies.length; ++i) {
        this.bodies[i].startFrame(step);
        this.bodies[i].getShapes(shapes);
      }
      GenerateCollisions(shapes, contacts, 0.1);
      for (var i = 0; i < this.constraints.length; ++i) {
        this.constraints[i].resolve(step, contacts);
      }
      ResolveContacts(contacts);

      for (var i = 0; i < this.bodies.length; ++i) {
        this.bodies[i].integrate(step);
      }
    }

    for (var i = 0; i < model.boneList.length; ++i) {
      var bone = model.boneList[i];
      mat4.multiply(bone.transform, bone.localTransform, bone.invTransform);
    }
  };

  DC.D3Ragdoll = D3Ragdoll;
})();
