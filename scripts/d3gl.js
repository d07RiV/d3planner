/**
 *
 * jquery.binarytransport.js
 *
 * @description. jQuery ajax transport for making binary data type requests.
 * @version 1.0 
 * @author Henry Algus <henryalgus@gmail.com>
 *
 */

// use this transport for "binary" data type
$.ajaxTransport("+binary", function(options, originalOptions, jqXHR){
    // check for conditions and support for blob / arraybuffer response type
    if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob)))))
    {
        return {
            // create new XMLHttpRequest
            send: function(headers, callback){
    // setup all variables
                var xhr = new XMLHttpRequest(),
    url = options.url,
    type = options.type,
    async = options.async || true,
    // blob or arraybuffer. Default is blob
    dataType = options.responseType || "blob",
    data = options.data || null,
    username = options.username || null,
    password = options.password || null;
          
                xhr.addEventListener('load', function(){
      var data = {};
      data[options.dataType] = xhr.response;
      // make callback and send data
      callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                });

                xhr.open(type, url, async, username, password);
        
    // setup custom headers
    for (var i in headers ) {
      xhr.setRequestHeader(i, headers[i] );
    }
        
                xhr.responseType = dataType;
                xhr.send(data);
            },
            abort: function(){
                jqXHR.abort();
            }
        };
    }
});

(function() {
  var DC = DiabloCalc;
  var $enabled = false, $canvas, $orig;

  var shaderSources = new Array(2);

  function ReadString(view, offset, length) {
    var codes = [];
    for (var i = 0; i < length; ++i) {
      var code = view.getUint8(offset + i);
      if (!code) break;
      codes.push(code);
    }
    return String.fromCharCode.apply(null, codes).toLowerCase();
  }

  var textureMap = {};
  function getTexture(gl, id) {
    if (id === 0) return null;
    if (id in textureMap) return textureMap[id].texture;
    var texture = {};
    textureMap[id] = texture;
    texture.texture = null;
    texture.image = new Image();
    texture.image.onload = function() {
      texture.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.bindTexture(gl.TEXTURE_2D, null);
    };
    texture.image.src = "webgl/textures/" + id;
    return texture.texture;
  }

  var resourceMap = {};
  function getResource(name, func) {
    if (!resourceMap[name]) {
      var rc = {callbacks: []};
      resourceMap[name] = rc;
      $.ajax({
        url: "webgl/" + name,
        type: "GET",
        dataType: "binary",
        responseType: "arraybuffer",
        processData: false,
      }).done(function(data) {
        rc.data = data;
        for (var i = 0; i < rc.callbacks.length; ++i) {
          rc.callbacks[i](data);
        }
        delete rc.callbacks;
      });
    }
    var rc = resourceMap[name];
    if (rc.data) {
      func(rc.data);
    } else if (rc.callbacks) {
      rc.callbacks.push(func);
    }
  }

  function D3Material(raw, gl) {
    this.raw = raw;
    this.gl = gl;
  }
/*  D3Material.prototype.alpha = function(index) {
    return this.raw.getFloat32(index * 16, true);
  };*/
  D3Material.prototype.diffuse = function(index) {
    return getTexture(this.gl, this.raw.getUint32(index * 16, true));
  };
  D3Material.prototype.specular = function(index) {
    return getTexture(this.gl, this.raw.getUint32(index * 16 + 4, true));
  };
  D3Material.prototype.tintbase = function(index) {
    return getTexture(this.gl, this.raw.getUint32(index * 16 + 8, true));
  };
  D3Material.prototype.tintmask = function(index) {
    return getTexture(this.gl, this.raw.getUint32(index * 16 + 12, true));
  };

  function D3Animation(id) {
    var self = this;
    getResource("animations/" + id, function(data) {
      self.load(data);
    });
  }
  D3Animation.prototype.loaded = function() {
    return !!this.bones;
  };
  D3Animation.prototype.duration = function() {
    if (!this.bones) return 0;
    var time = (this.frames - 1) / this.velocity / 60;
    if (this.queued) {
      var stats = DC.getStats();
      if (stats.info.aps) time /= stats.info.aps;
    }
    return time;
  };
  D3Animation.prototype.load = function(data) {
    var view = new DataView(data);
    this.frames = view.getUint32(0, true);
    this.velocity = view.getFloat32(4, true);
    var numBones = view.getUint32(8, true);
    var animationOffset = view.getUint32(12, true);
    this.bones = [];
    for (var i = 0; i < numBones; ++i) {
      var offset = animationOffset + i * 88;
      var bone = {};
      bone.name = ReadString(view, offset, 64);
/*      if (bone.name.indexOf("left") >= 0) {
        bone.name = bone.name.replace("left", "right");
      } else if (bone.name.indexOf("right") >= 0) {
        bone.name = bone.name.replace("right", "left");
      }*/
      var numTranslations = view.getUint32(offset + 64, true);
      var translationOffset = view.getUint32(offset + 68, true);
      var numRotations = view.getUint32(offset + 72, true);
      var rotationOffset = view.getUint32(offset + 76, true);
      var numScales = view.getUint32(offset + 80, true);
      var scaleOffset = view.getUint32(offset + 84, true);
      bone.translations = [];
      for (var j = 0; j < numTranslations; ++j) {
        var offset = translationOffset + j * 16;
        bone.translations.push({
          frame: view.getUint32(offset, true),
          value: new Float32Array(data, offset + 4, 3),
        });
//        bone.translations[j].value = vec3.clone(bone.translations[j].value);
//        bone.translations[j].value[1] = -bone.translations[j].value[1];
      }
      bone.rotations = [];
      for (var j = 0; j < numRotations; ++j) {
        var offset = rotationOffset + j * 20;
        bone.rotations.push({
          frame: view.getUint32(offset, true),
          value: new Float32Array(data, offset + 4, 4),
        });
//        bone.rotations[j].value = quat.clone(bone.rotations[j].value);
//        bone.rotations[j].value[1] = -bone.rotations[j].value[1];
//        bone.rotations[j].value[3] = -bone.rotations[j].value[3];
      }
      bone.scales = [];
      for (var j = 0; j < numScales; ++j) {
        var offset = scaleOffset + j * 8;
        bone.scales.push({
          frame: view.getUint32(offset, true),
          value: view.getFloat32(offset + 4, true),
        });
      }
      this.bones.push(bone);
    }
  };
  (function() {
    var tvec = vec3.create(), tmat = mat4.create(), tquat = quat.create();
    function applyTranslation(mat, value1, value2, t) {
      mat4.translate(mat, mat, vec3.lerp(tvec, value1, value2, t));
    }
    function applyRotation(mat, value1, value2, t) {
      mat4.multiply(mat, mat, mat4.fromQuat(tmat, quat.slerp(tquat, value1, value2, t)));
    }
    function applyScale(mat, value1, value2, t) {
      var scale = value1 * (1.0 - t) + value2 * t;
      mat4.scale(mat, mat, vec3.set(tvec, scale, scale, scale));
    }
    function findKey(frame, list) {
      var L = 0;
      var R = list.length;
      while (R - L > 1) {
        var M = Math.floor((L + R) / 2);
        if (list[M].frame < frame) {
          L = M;
        } else {
          R = M;
        }
      }
      return L;
    }
    function applyCurve(mat, frame, list, func) {
      if (!list.length) return;
      var pos = findKey(frame, list);
      if (pos < list.length - 1) {
        func(mat, list[pos].value, list[pos + 1].value, (frame - list[pos].frame) / (list[pos + 1].frame - list[pos].frame));
      } else {
        func(mat, list[pos].value, list[pos].value, 0);
      }
    }

    D3Animation.prototype.update = function(model, time, transform) {
      if (!this.bones) return;
      var frame = time * 60 * this.velocity;
      if (this.queued) {
        var stats = DC.getStats();
        if (stats.info.aps) frame *= stats.info.aps;
      }
      frame -= (this.frames - 1) * Math.floor(frame / (this.frames - 1));
      for (var i = 0; i < model.boneList.length; ++i) {
        mat4.identity(model.boneList[i].localTransform);
      }
      for (var i = 0; i < this.bones.length; ++i) {
        var curve = this.bones[i];
        var bone = model.bones[curve.name];
        if (!bone) continue;
        applyCurve(bone.localTransform, frame, curve.translations, applyTranslation);
        applyCurve(bone.localTransform, frame, curve.rotations, applyRotation);
        applyCurve(bone.localTransform, frame, curve.scales, applyScale);
      }
      for (var i = 0; i < model.boneList.length; ++i) {
        var bone = model.boneList[i];
        if (bone.parent) {
          mat4.multiply(bone.localTransform, bone.parent.localTransform, bone.localTransform);
        } else {
          mat4.multiply(bone.localTransform, transform, bone.localTransform);
        }
        mat4.multiply(bone.transform, bone.localTransform, bone.invTransform);
      }
      model.animated = true;
    };
  })();

  function D3AnimSequence(ids, flagCallback) {
    this.list = [];
    this.cache = {};
    this.flagCallback = flagCallback;
    this.rigged = 0;
    for (var i = 0; i < ids.length; ++i) {
      this.list.push(new D3Animation(ids[i][0]));
      this.list[i].flag = ids[i][1];
      this.list[i].weight = (i == 0 ? 0.95 : 0.05 / (ids.length - 1));
    }
  }
  D3AnimSequence.prototype._fetch = function(id) {
    if (this.cache[id]) return this.cache[id];
    return this.cache[id] = new D3Animation(id);
  };
  D3AnimSequence.prototype.__choose = function(initial) {
    var sum = 0;
    for (var i = (initial || 0); i < this.list.length; ++i) {
      if (this.list[i].loaded()) sum += this.list[i].weight;
    }
    if (!sum) {
      if (initial) return this._choose();
      return;
    }
    sum *= Math.random();
    for (var i = (initial || 0); i < this.list.length; ++i) {
      if (this.list[i].loaded()) {
        if (sum < this.list[i].weight) return this.list[i];
        sum -= this.list[i].weight;
      }
    }
    for (var i = (initial || 0); i < this.list.length; ++i) {
      if (this.list[i].loaded()) return this.list[i];
    }
  };
  D3AnimSequence.prototype._choose = function(initial) {
    if (this.queued && this.queued.length && this.queued[0].loaded()) {
      this.rigged = 5;
      return this.queued.shift();
    }
    if (this.rigged > 0 && this.list[0].loaded()) {
      this.rigged -= 1;
      return this.list[0];
    }
    var res = this.__choose();
    if (res != this.list[0]) {
      this.rigged = 5;
    }
    return res;
  };
  D3AnimSequence.prototype.choose = function() {
    this.time = this.lastTime;
    this.current = this.__choose(1);
    this.rigged = 5;
  };
  D3AnimSequence.prototype.update = function(model, time, transform) {
    if (this.time === undefined) this.time = time;
    if ((!this.current || !this.current.queued) && this.queued && this.queued.length && this.queued[0].loaded) {
      this.time = time;
      this.current = this._choose();
    }
    this.lastTime = time;
    if (!this.current) this.current = this._choose();
    while (this.current && time > this.time + this.current.duration()) {
      this.time += this.current.duration();
      this.current = this._choose();
    }
    if (this.current) {
      if (this.current.flag !== this.flag) {
        this.flagCallback(this.flag = this.current.flag);
      }
      this.current.update(model, time - this.time, transform);
    }
  };
  D3AnimSequence.prototype.queue = function(ids) {
    this.queued = [];
    for (var i = 0; i < ids.length; ++i) {
      this.queued.push(this._fetch(ids[i][0]));
      this.queued[i].flag = ids[i][1];
      this.queued[i].queued = true;
    }
  };
  D3AnimSequence.prototype.prepare = function(ids) {
    for (var i = 0; i < ids.length; ++i) {
      this._fetch(ids[i][0]);
    }
  };

  var AnimTypeParent = [
    -1, // 0: None
    0, // 1: Hand - to - hand
    0, // 2: 1H Swing
    0, // 3: 1H Thrust
    0, // 4: 2H Swing
    0, // 5: 2H Thrust
    4, // 6: Staff -> 2H Swing
    0, // 7: Bow
    0, // 8: Crossbow
    0, // 9: Wand
    0, // 10: Dual Wield
    1, // 11: HtH w / Orb -> HtH
    2, // 12: 1HS w / Orb -> 1HS
    3, // 13: 1HT w / Orb -> 1HT
    10, // 14: Dual Wield SF -> Dual Wield
    10, // 15: Dual Wield FF -> Dual Wield
    1, // 16: 1H Fist
    4, // 17: 2H Axe / Mace -> 2H Swing
    0, // 18: HandXBow
    9, // 19: Wand w / Orb -> Wand
    2, // 20: 1H Swing w / Shield -> 1HS
    3, // 21: 1H Thrust w / Shield -> 1HT
    1, // 22: Hth w / Shield -> HtH
    4, // 23: 2H Swing w / Shield -> 2HS
    5, // 24: 2H Thrust w / Shield -> 2HT
    6, // 25: Staff w / Shield -> Staff
    4, // 26: 2H Flail -> 2H Swing
    26, // 27: 2H Flail w / Shield -> 2H Flail
    0, // 28: On Horse
  ];

  function D3AnimSet(id) {
    var self = this;
    getResource("animsets/" + id, function(data) {
      self.load(data);
    });
  }
  D3AnimSet.prototype.load = function(data) {
    this.data = [];
    var ints = new Int32Array(data);
    var index = 0;
    for (var i = 0; i < 29; ++i) {
      var anims = {};
      var count = ints[index++];
      while (count--) {
        var type = ints[index++];
        anims[type] = ints[index++];
      }
      this.data.push(anims);
    }
    if (this.request) {
      this.doGet(this.request.callback, this.request.id, this.request.type);
      delete this.request;
    }
  };
  D3AnimSet.prototype._doGet = function(id, type) {
    var origType = type;
    while (type >= 0) {
      if (id in this.data[type]) {
        if (this.data[type][id] == -1) {
          return [this.data[0][id], true];
        } else {
          return [this.data[type][id], type === 0];
        }
      }
      type = AnimTypeParent[type];
    }
    if (id === 427776) {
      return [undefined, true];
    } else {
      return this._doGet(427776, origType);
    }
  };
  D3AnimSet.prototype.doGet = function(callback, id, type) {
    if (typeof id === "object" && "length" in id) {
      var res = [];
      for (var i = 0; i < id.length; ++i) {
        res.push(this._doGet(id[i], type));
      }
      callback(res);
    } else {
      callback(this._doGet(id, type));
    }
  };
  D3AnimSet.prototype.get = function(callback, id, type) {
    if (this.data) {
      this.doGet(callback, id, type);
    } else {
      this.request = {callback: callback, id: id, type: type};
    }
  };

  function D3Object(material, gl) {
    this.material = material;
    this.gl = gl;
    this.groups = [];
  }
  D3Object.prototype.addGroup = function(bones, vertices, indices) {
    var group = {};
    var gl = this.gl;
    group.bones = bones;
    group.vertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, group.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    group.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, group.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    group.numIndices = indices.length;
    this.groups.push(group);
  };
  D3Object.prototype.render = function(transform, appearance, boneList, tint, nodepth) {
    var gl = this.gl;
    if (this.material) {
//      gl.uniform1f(gl.u_alphaLoc, this.material.alpha(appearance));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, /*tint && this.material.tintbase(appearance) || */this.material.diffuse(appearance));
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tint && this.material.tintmask(appearance) || getTexture(gl, 0));
      if (tint) {
        gl.uniform3f(gl.u_TintLoc, tint.r, tint.g, tint.b);
      }
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.material.specular(appearance));
    }
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);
    gl.enableVertexAttribArray(4);
    for (var i = 0; i < this.groups.length; ++i) {
      var group = this.groups[i];
      if (!boneList.length) {
        this.gl.uniformMatrix4fv(this.gl.BonesLoc, false, transform);
      } else {
        var boneMat = new Float32Array(group.bones.length * 16);
        for (var j = 0; j < group.bones.length; ++j) {
          mat4.copy(boneMat.subarray(j * 16, j * 16 + 16), boneList[group.bones[j]].transform);
        }
        this.gl.uniformMatrix4fv(this.gl.BonesLoc, false, boneMat);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, group.vertices);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 36, 0);
      gl.vertexAttribPointer(1, 4, gl.BYTE, true, 36, 12);
      gl.vertexAttribPointer(2, 2, gl.SHORT, false, 36, 16);
      gl.vertexAttribPointer(3, 4, gl.UNSIGNED_BYTE, false, 36, 20);
      gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 36, 24);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, group.indices);

      gl.depthFunc(gl.LESS);
      gl.depthMask(!nodepth);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawElements(gl.TRIANGLES, group.numIndices, gl.UNSIGNED_SHORT, 0);
      gl.depthFunc(gl.GREATER);
      gl.depthMask(false);
      gl.blendFuncSeparate(gl.ONE_MINUS_DST_ALPHA, gl.DST_ALPHA, gl.ONE_MINUS_DST_ALPHA, gl.ONE);
      gl.drawElements(gl.TRIANGLES, group.numIndices, gl.UNSIGNED_SHORT, 0);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    if (this.material) {
      gl.uniform1f(gl.u_alphaLoc, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  };

  function D3Model(gl, id) {
    this.gl = gl;
    this.renderChain = [];
    this.subObjects = [];
    var self = this;
    getResource("models/" + id, function(data) {
      self.load(data);
    });
  }

  D3Model.prototype.load = function(data) {
    var view = new DataView(data);
    var numBones = view.getUint32(0, true);
    var boneOffset = view.getUint32(4, true);
    var numHardpoints = view.getUint32(8, true);
    var hardpointOffset = view.getUint32(12, true);
    var numObjects = view.getUint32(16, true);
    var objectOffset = view.getUint32(20, true);
    var numMaterials = view.getUint32(24, true);
    var numAppearances = view.getUint32(28, true);
    var materialOffset = view.getUint32(32, true);
    this.center = new Float32Array(data, 36, 3);

    this.boneList = [];
    this.bones = {};
    for (var i = 0; i < numBones; ++i) {
      var offset = boneOffset + i * 108;
      var capsuleOffset = view.getUint32(offset + 100, true);
      var constraintOffset = view.getUint32(offset + 104, true);
      var bone = {};
      bone.name = ReadString(view, offset, 64);
      var parentIdx = view.getInt32(offset + 64, true);
      if (parentIdx != -1) bone.parent = this.boneList[parentIdx];
      bone.prsTransform = {
        rotate: new Float32Array(data, offset + 68, 4),
        translate: new Float32Array(data, offset + 84, 3),
        scale: view.getFloat32(offset + 96, true),
      };
      var scale = bone.prsTransform.scale;
      bone.localTransform = mat4.fromRotationTranslationScale(mat4.create(),
        bone.prsTransform.rotate, bone.prsTransform.translate,
        vec3.fromValues(scale, scale, scale));
      bone.invTransform = mat4.invert(mat4.create(), bone.localTransform);
      bone.transform = mat4.create();
      if (capsuleOffset) {
        bone.capsule = {
          start: new Float32Array(data, capsuleOffset, 3),
          end: new Float32Array(data, capsuleOffset + 12, 3),
          radius: view.getFloat32(capsuleOffset + 24, true),
        };
      }
      if (constraintOffset) {
        bone.constraint = {
          parent: {
            rotate: new Float32Array(data, constraintOffset, 4),
            translate: new Float32Array(data, constraintOffset + 16, 3),
          },
          local: {
            rotate: new Float32Array(data, constraintOffset + 28, 4),
            translate: new Float32Array(data, constraintOffset + 44, 3),
          },
          values: new Float32Array(data, constraintOffset + 56, 5),
        };
      }
      this.boneList.push(bone);
      this.bones[bone.name] = bone;
    }
    this.hardpoints = {};
    for (var i = 0; i < numHardpoints; ++i) {
      var offset = hardpointOffset + i * 132;
      var hp = {};
      hp.name = ReadString(view, offset, 64);
      var parentIdx = view.getInt32(offset + 64, true);
      if (parentIdx != -1) hp.parent = this.boneList[parentIdx];
      hp.relTransform = new Float32Array(data, offset + 68, 16);
      hp.transform = mat4.clone(hp.relTransform);
      this.hardpoints[hp.name] = hp;
    }
    this.materials = [];
    for (var i = 0; i < numMaterials; ++i) {
      var offset = materialOffset + i * 16 * numAppearances;
      this.materials.push(new D3Material(new DataView(data, offset, numAppearances * 16), this.gl));
    }
    this.objects = [];
    for (var i = 0; i < numObjects; ++i) {
      var offset = objectOffset + i * 12;
      var material = view.getUint32(offset, true);
      var object = new D3Object(this.materials[material], this.gl);
      this.objects.push(object);
      var numGroups = view.getUint32(offset + 4, true);
      var groupOffset = view.getUint32(offset + 8, true);
      for (var j = 0; j < numGroups; ++j) {
        var offset = groupOffset + j * 24;
        var numBones = view.getUint32(offset, true);
        var boneOffset = view.getUint32(offset + 4, true);
        var numVertices = view.getUint32(offset + 8, true);
        var vertexOffset = view.getUint32(offset + 12, true);
        var numIndices = view.getUint32(offset + 16, true);
        var indexOffset = view.getUint32(offset + 20, true);
        object.addGroup(new Uint32Array(data, boneOffset, numBones),
          new Uint8Array(data, vertexOffset, numVertices * 36),
          new Uint16Array(data, indexOffset, numIndices));
      }
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  };
  D3Model.prototype.enable = function(index, appearance, prio, nodepth, tint) {
    if (typeof index === "object") {
      for (var i = 0; i < index.length; ++i) {
        this.enable(index[i], appearance, prio, nodepth, tint);
      }
    } else {
      this.renderChain.push({index: index, appearance: appearance, prio: prio, nodepth: nodepth, tint: tint});
    }
    return this;
  };
  D3Model.prototype.disable = function(index) {
    if (typeof index === "object") {
      for (var i = 0; i < index.length; ++i) {
        this.disable(index[i]);
      }
    } else {
      for (var i = 0; i < this.renderChain.length; ++i) {
        if (this.renderChain[i].index === index) {
          this.renderChain.splice(i--, 1);
        }
      }
    }
    return this;
  };
  D3Model.prototype.animate = function(animation) {
    if (typeof animation === "number") {
      animation = new D3Animation(animation);
    }
    return this.animation = animation;
  };
  D3Model.prototype.setRagdoll = function(id) {
    this.animation = new DC.D3Ragdoll(this.gl);
  };
  D3Model.prototype.attach = function(hp, model) {
    if (typeof model === "number") {
      model = new D3Model(this.gl, model);
    }
    var att = {hp: hp, model: model};
    this.subObjects.push(att);
    return att;
  };
  D3Model.prototype.detach = function(att) {
    var index = this.subObjects.indexOf(att);
    if (index >= 0) this.subObjects.splice(index, 1);
  };
  D3Model.prototype.update = function(time, transform) {
    if (this.objects && this.animation) {
      this.animation.update(this, time, transform);
      for (var name in this.hardpoints) {
        var hp = this.hardpoints[name];
        if (hp.parent) {
          mat4.multiply(hp.transform, hp.parent.localTransform, hp.relTransform);
        } else {
          mat4.multiply(hp.transform, transform, hp.relTransform);
        }
      }
    }
  };
  D3Model.prototype.render = function(time, transform) {
    if (!this.objects) return;
    if (this.scale) {
      transform = mat4.scale(mat4.create(), transform, [this.scale, this.scale, this.scale]);
    }
    if (time !== undefined) {
      this.update(time, transform);
    }
    this.renderChain.sort(function(a, b) {return (a.prio || 0) - (b.prio || 0);});
    for (var i = 0; i < this.renderChain.length; ++i) {
      var cur = this.renderChain[i];
      if (cur.index >= this.objects.length || cur.prio >= 10) continue;
      this.objects[cur.index].render(transform, cur.appearance, this.boneList, cur.tint, cur.nodepth);
    }
    for (var i = 0; i < this.subObjects.length; ++i) {
      var obj = this.subObjects[i];
      var hp = this.hardpoints[obj.hp];
      if (!hp) continue;
      obj.model.render(time, hp.transform);
    }
    for (var i = 0; i < this.renderChain.length; ++i) {
      var cur = this.renderChain[i];
      if (cur.index >= this.objects.length || cur.prio < 10) continue;
      this.objects[cur.index].render(transform, cur.appearance, this.boneList, cur.tint, cur.nodepth);
    }
  };

  function D3Character(gl, actor) {
    this.actor = actor;
    this.model = new D3Model(gl, actor);
    this.animset = new D3AnimSet(actor);
    this.animations = [427776/*69632*/, 426960, 410112, 410113, 410115, 410116, 410117, 410118, 410119, 86272, 86273, 86274, 86275];

    this.data = (DC.webglCharacters[actor] || {});
    this.slots = {
      head: {},
      shoulders: {},
      torso: {},
      hands: {},
      legs: {},
      feet: {},
      mainhand: {},
      offhand: {},
    };
    var self = this;
    setTimeout(function() {
      if (self.data.beard) {
        self.model.enable(self.data.beard, 0, 10, true);
      }
      for (var slot in DC.itemSlots) {
        onUpdateSlot(slot);
      }
    }, 0);
  }
  function _animType(mh, oh) {
    var mhw = (mh && DC.itemTypes[mh] && DC.itemTypes[mh].weapon && DC.itemTypes[mh].weapon.type);
    var ohw = (oh && DC.itemTypes[oh] && DC.itemTypes[oh].weapon && DC.itemTypes[oh].weapon.type);
    if (oh === "source" || oh === "mojo" || oh === "phylactery" || oh === "quiver") {
      switch (mhw) {
      case undefined: return 11;
      case "swing": return 12;
      case "thrust": return 13;
      case "wand": return 19;
      default: return _animType(mh, undefined);
      }
    }
    if (oh === "shield" || oh === "crusadershield") {
      if (mh === "flail2h") return 27;
      switch (mhw) {
      case "swing": return 20;
      case "thrust": return 21;
      case undefined: return 22;
      case "fist": return 16;
      case "swing2h": return 23;
      case "thrust2h": return 24;
      case "staff": return 25;
      default: return _animType(mh, undefined);
      }
    }
    if (ohw) {
      return (ohw === "fist" ? (mhw === "fist" ? 15 : 14) : 10);
    }
    if (mh === "flail2h") return 26;
    if (mh === "axe2h" || mh === "mace2h") return 17;
    switch (mhw) {
    case "swing": return 2;
    case "thrust": return 3;
    case "swing2h": return 4;
    case "thrust2h": return 5;
    case "staff": return 6;
    case "bow": return 7;
    case "crossbow": return 8;
    case "wand": return 9;
    case "fist": return 16;
    case "handcrossbow": return 18;
    default: return 1;
    }
  }
  D3Character.prototype.animType = function() {
    var mhType = (this.slots.mainhand.item && this.slots.mainhand.item.type);
    var ohType = (this.slots.offhand.item && this.slots.offhand.item.type);
    return _animType(mhType, ohType);
  };
  D3Character.prototype._mhpoint = function() {
    if (this.isNoneType) {
      return "hp_sheath_right_hip";
    } else {
      return "hp_rightweapon";
    }
  };
  D3Character.prototype._ohpoint = function() {
    var ohtype = this.slots.offhand.item.type;
    if (this.isNoneType) {
      if (ohtype === "shield" || ohtype === "crusadershield") {
        return "hp_sheath_shield";
      } else if (ohtype === "quiver") {
        return "hp_sheath_left_back";
      } else if (DC.itemTypes[ohtype] && DC.itemTypes[ohtype].weapon) {
        return "hp_sheath_left_hip";
      } else {
        return "hp_none";
      }
    } else {
      if (ohtype === "shield" || ohtype === "crusadershield") {
        return "hp_shield";
      } else if (ohtype === "quiver") {
        return "hp_sheath_left_back";
      } else {
        return "hp_leftweapon";
      }
    }
  };
  D3Character.prototype.updateAnimation = function() {
    var self = this;
    this.animset.get(function(ids) {
      self.model.animate(new D3AnimSequence(ids, function(none) {
        self.isNoneType = none;
        if (self.slots.mainhand.item && self.slots.mainhand.att) {
          self.slots.mainhand.att.hp = self._mhpoint();
        }
        if (self.slots.offhand.item && self.slots.offhand.att) {
          self.slots.offhand.att.hp = self._ohpoint();
        }
      }));
    }, this.animations, this.animType());
  };
  D3Character.prototype.animate = function(id) {
    var self = this;
    if (!(id instanceof Array)) id = [id];
    this.animset.get(function(ids) {
      if (self.model.animation) {
        self.model.animation.queue(ids);
      }
    }, id, this.animType());
  };
  D3Character.prototype.prepare = function(id) {
    var self = this;
    if (!(id instanceof Array)) id = [id];
    this.animset.get(function(ids) {
      if (self.model.animation) {
        self.model.animation.prepare(ids);
      }
    }, id, this.animType());
  };
  D3Character.prototype._attach = function(hp, actor, tint) {
    if (typeof actor === "object") actor = actor[this.actor];
    if (!actor) return;
    var att = this.model.attach(hp, actor);
    var info = DC.webglActors[actor];
    if (info) {
      if (info.hair !== undefined) this._enable("hair", info.hair, 0, 12, true);
      if (info.animation) att.model.animate(info.animation);
      if (info.physics) att.model.setRagdoll(info.physics);
      if (info.scale) att.model.scale = info.scale;
      for (var id in info.enable) {
        att.model.enable(id, info.enable[id], 0, false, tint);
      }
    }
    return att;
  };
  D3Character.prototype._enable = function(type, key, look, prio, nodepth, tint) {
    var list = this.data[type];
    for (var id in list) {
      this.model.disable(list[id]);
    }
    if (key in list) {
      this.model.enable(list[key], look, prio, nodepth, tint);
    }
  };
  var _slotPrio = {legs: 0, hands: 1, torso: 2, feet: 3};
  D3Character.prototype.equip = function(slot, id, tint) {
    if (!(slot in this.slots)) return;
    tint = (tint && DC.webglDyes[tint]);
    if (tint && tint.type === 21) id = undefined;
    var item = (id && (DC.itemById[id] || DC.webglItems[id]));
    if (item && item.type === "quiver") {
      id = undefined;
      item = undefined;
    }
    tint = (tint && tint.color);
    if ("id" in this.slots[slot] && this.slots[slot].id === id) {
      if (this.slots[slot].tint !== tint) {
        this.slots[slot].tint = tint;
        if (this.slots[slot].att) {
          $.each(this.slots[slot].att.model.renderChain, function(i, obj) {
            obj.tint = tint;
          });
          if (this.slots[slot].att_r) {
            $.each(this.slots[slot].att_r.model.renderChain, function(i, obj) {
              obj.tint = tint;
            });
          }
          return;
        }
      } else {
        return;
      }
    }
    this.slots[slot].id = id;
    this.slots[slot].tint = tint;
    this.slots[slot].item = item;
    var itemInfo = (id && DC.webglItems[id]);
    if (this.slots[slot].att) {
      this.model.detach(this.slots[slot].att);
      delete this.slots[slot].att;
    }
    if (this.slots[slot].att_r) {
      this.model.detach(this.slots[slot].att_r);
      delete this.slots[slot].att_r;
    }
    if (item && itemInfo) {
      switch (slot) {
      case "head":
        this.slots.head.att = this._attach("hp_helm", itemInfo.actor, tint);
        break;
      case "shoulders":
        this.slots.shoulders.att = this._attach("hp_left_shoulderpad", itemInfo.actor, tint);
        this.slots.shoulders.att_r = this._attach("hp_right_shoulderpad", itemInfo.actor_r, tint);
        break;
      case "mainhand":
        this.slots.mainhand.att = this._attach(this._mhpoint(), itemInfo.actor, tint);
        break;
      case "offhand":
        this.slots.offhand.att = this._attach(this._ohpoint(), itemInfo.actor, tint);
        break;
      }
    }
    switch (slot) {
    case "head":
      if (!item) this._enable("hair", -1, 0, 12, true);
      break;
    case "feet":
    case "hands":
    case "legs":
    case "torso":
      this._enable(slot, itemInfo && itemInfo.armortype || -1, itemInfo && this.data.looks[itemInfo.look] || 0, _slotPrio[slot], false, tint);
      break;
    }
    this.updateAnimation();
  };


  function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var error = gl.getShaderInfoLog(shader);
      gl.console.log("*** Error compiling shader: " + error);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function initGL(canvas) {
    var gl = canvas.getContext("webgl");//, {premultipliedAlpha: false});
    if (!gl) return null;
    gl.canvas = canvas;

    // Add a console
    gl.consoleDiv = $("#console");
    gl.console = {log: function() {console.log.apply(console, arguments);}};

    // create our shaders
    function makeProgram(vsSource, psSource) {
      var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
      var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, psSource);
      if (!vertexShader || !fragmentShader) return null;
      var program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      var attribs = ["vPosition", "vNormal", "vTexture", "vBoneIndex", "vBoneWeight"];
      for (var i in attribs) gl.bindAttribLocation(program, i, attribs[i]);
      gl.linkProgram(program);
      var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (!linked) {
        var error = gl.getProgramInfoLog(program);
        gl.console.log("Error in program linking:" + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
      }
      return program;
    }
    gl.program = makeProgram(shaderSources[0], shaderSources[1]);
    //gl.program_tint = makeProgram(shaderSources[0], shaderSources[2]);
    //gl.program_tint_base = makeProgram(shaderSources[0], shaderSources[3]);
    if (!gl.program) return null;
    gl.useProgram(gl.program);

    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(50);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    return gl;
  }

  function Ground(gl, size) {
    this.gl = gl;
    this.vertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
    var vertexData = new ArrayBuffer(36 * 4);
    var vertexPos = new Float32Array(vertexData, 0), stridePos = 36 / 4;
    var vertexNormal = new Int8Array(vertexData, 12), strideNormal = 36;
    var vertexTex = new Int16Array(vertexData, 16), strideTex = 36 / 2;
    var vertexBoneIndex = new Uint8Array(vertexData, 20), strideBoneIndex = 36;
    var vertexBoneWeight = new Float32Array(vertexData, 24), strideBoneWeight = 36 / 4;
    vertexPos.set([size, size, 0], 0); vertexNormal.set([0, 0, 127], 0); vertexTex.set([512, 512], 0);
    vertexPos.set([-size, size, 0], stridePos); vertexNormal.set([0, 0, 127], strideNormal); vertexTex.set([512, 0], strideTex);
    vertexPos.set([-size, -size, 0], stridePos * 2); vertexNormal.set([0, 0, 127], strideNormal * 2); vertexTex.set([0, 0], strideTex * 2);
    vertexPos.set([size, -size, 0], stridePos * 3); vertexNormal.set([0, 0, 127], strideNormal * 3); vertexTex.set([0, 512], strideTex * 3);
    vertexBoneWeight[0] = 1; vertexBoneWeight[strideBoneWeight] = 1; vertexBoneWeight[strideBoneWeight * 2] = 1; vertexBoneWeight[strideBoneWeight * 3] = 1;
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    this.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
  Ground.prototype.render = function(transform) {
    var gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, getTexture(gl, 43673));
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, null);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);
    gl.enableVertexAttribArray(4);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 36, 0);
    gl.vertexAttribPointer(1, 4, gl.BYTE, true, 36, 12);
    gl.vertexAttribPointer(2, 2, gl.SHORT, false, 36, 16);
    gl.vertexAttribPointer(3, 4, gl.UNSIGNED_BYTE, false, 36, 20);
    gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 36, 24);
    gl.uniformMatrix4fv(gl.BonesLoc, false, transform);
    gl.depthFunc(gl.LESS);
    gl.depthMask(true);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  };

  function Reshape() {
    var width = this.canvas.width;
    var height = this.canvas.height;
    var fov = (this.character && this.character.data.fov || 12);
    if (width === this.width && height === this.height && fov == this.prevFov) return;
    this.width = width;
    this.height = height;
    this.prevFov = fov;
    this.viewport(0, 0, width, height);
    this.perspectiveMatrix = mat4.perspective(mat4.create(), 0.7, width / height, 1, 50);
    mat4.multiply(this.perspectiveMatrix, this.perspectiveMatrix, [
      0, 0, 1, 0,
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, -fov, 1,
    ]);
    this.uniformMatrix4fv(this.u_projMatrixLoc, false, this.perspectiveMatrix);
  }
  function Render(time) {
    var gl = this;
    if ($enabled && document.hidden !== true) {
      gl.reshape();
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      mat4.fromZRotation(gl.mvMatrix, gl.viewAngle);
      var center = (gl.character && gl.character.model.center);
      if (center) {
        var dy = (gl.character && gl.character.data.y || 0.75);
        mat4.translate(gl.mvMatrix, gl.mvMatrix, vec3.fromValues(-center[0], -center[1], -center[2] + dy));
      }

      if (gl.ground) gl.ground.render(gl.mvMatrix);

      if (gl.character) {
        gl.character.model.render(time * 0.001, gl.mvMatrix);
      }

      gl.flush();
    }

    window.requestAnimationFrame(function(time) { gl.render(time); });
  }

  function onMouseDown(gl, e) {
    if (e) {
      gl.dragPos = [e.clientX, e.clientY];
      gl.dragStart = [e.clientX, e.clientY];
      e.preventDefault();
      return false;
    }
  }
  function onMouseMove(gl, e) {
    if (e && gl.dragPos && (e.buttons & 1)) {
      gl.viewAngle += (e.clientX - gl.dragPos[0]) * 0.005;
      gl.dragPos = [e.clientX, e.clientY];
      e.preventDefault();
      return false;
    }
  }
  function onMouseUp(gl, e) {
    if (gl.dragPos) {
      if (Math.abs(gl.dragPos[0] - gl.dragStart[0]) < 2 && Math.abs(gl.dragPos[1] - gl.dragStart[1]) < 2) {
        if (gl.character && gl.character.model && gl.character.model.animation && gl.character.model.animation.choose) {
          gl.character.model.animation.choose();
        }
      }
      delete gl.dragPos;
      delete gl.dragStart;
      e.preventDefault();
      return false;
    }
  }
  function touchTranslate(e) {
    if (e.originalEvent.touches.length > 1) return;
    var ne = $.extend({buttons: 1, clientX: 0, clientY: 0}, e.originalEvent.touches[0]);
    ne.preventDefault = function() {e.preventDefault();};
    return ne;
  }

  function onChangeClass() {
    if (DC.webglClasses[DC.charClass]) {
      var actor = DC.webglClasses[DC.charClass][DiabloCalc.gender || "female"];
      DC.d3gl.character = new D3Character(DC.d3gl, actor);
    } else {
      DC.d3gl.character = undefined;
    }
  }
  function onUpdateSlot(slot) {
    if (DC.d3gl.character) {
      var data = DC.getSlot(slot);
      var id = data && (data.transmog || (data.rwbase && (data.rwbase.transmog || data.rwbase.id)) || data.id);
      var dye = data && ((data.rwbase && data.rwbase.dye) || data.dye);
      DC.d3gl.character.equip(slot, id, dye);
    }
  }

  function checkLoaded() {
    if (shaderSources[0] && shaderSources[1]) {
      checkLoaded = function() {};
      var gl = initGL($canvas.find("canvas")[0]);
      if (!gl) {
        $canvas.append("<div class=\"d3gl-error\"><b>" + _L("Failed to load WebGL") + "</b><br/>" +
          _L("Visit {0} for more information.").format("<a target=\"_blank\" href=\"http://get.webgl.org/\">http://get.webgl.org/</a>") + "</div>");
        return;
      }
      DC.d3gl = gl;
      var lightDir = vec3.normalize(vec3.create(), vec3.fromValues(1, 0.4, 0.4));
      gl.uniform3f(gl.getUniformLocation(gl.program, "lightDir"), lightDir[0], lightDir[1], lightDir[2]);
      gl.mvMatrix = mat4.create();
      gl.u_projMatrixLoc = gl.getUniformLocation(gl.program, "u_projMatrix");
      gl.BonesLoc = gl.getUniformLocation(gl.program, "Bones");
      gl.u_alphaLoc = gl.getUniformLocation(gl.program, "u_alpha");
      gl.uniform1f(gl.u_alphaLoc, 1);
      gl.u_TintLoc = gl.getUniformLocation(gl.program, "u_Tint");
      gl.mvpMatrix = mat4.create();
      gl.reshape = Reshape;
      gl.render = Render;
      gl.viewAngle = 0;
      var texLoc = gl.getUniformLocation(gl.program, "sampler");
      gl.uniform1i(texLoc, 0);
      texLoc = gl.getUniformLocation(gl.program, "sampler_tint");
      gl.uniform1i(texLoc, 1);
      texLoc = gl.getUniformLocation(gl.program, "sampler_spec");
      if (texLoc) gl.uniform1i(texLoc, 2);

      gl.enabled = function() { return $enabled; };

      gl.character = new D3Character(gl, 6526);

      $canvas.mousedown(function(e) {
        onMouseDown(gl, e);
      });
      $canvas[0].addEventListener("touchstart", function(e) {
        return onMouseDown(gl, touchTranslate(e));
      }, {passive: true});
      $(window).mousemove(function(e) {
        onMouseMove(gl, e);
      }).mouseup(function(e) {
        onMouseUp(gl, e);
      })
      window.addEventListener("touchmove", function(e) {
        return onMouseMove(gl, touchTranslate(e));
      }, {passive: true});
      window.addEventListener("touchend", function(e) {
        return onMouseUp(gl, touchTranslate(e));
      }, {passive: true});

      window.requestAnimationFrame(function(time) { gl.render(time); });

      onChangeClass();
      DiabloCalc.register("changeClass", onChangeClass);
      DiabloCalc.register("changeGender", onChangeClass);
      DiabloCalc.register("updateSlotItem", onUpdateSlot);
      DiabloCalc.register("importEnd", function() {
        for (var slot in DC.itemSlots) {
          onUpdateSlot(slot);
        }
      });
    }
  }

  var button = $("<span class=\"d3gl-toggle\"></span>").click(function() {
    DiabloCalc.activity("modelview");
    if (!$canvas) {
      $canvas = $("<div class=\"d3gl-container\"><canvas width=\"520\" height=\"510\"></canvas></div>");
      $orig = $(".paperdoll-background");
      button.after($canvas);
      $orig.hide();
      function getSource(name, index) {
        $.ajax({
          url: "webgl/" + name + "?" + Math.floor(Math.random() * 1000000),
          type: "GET",
          dataType: "text",
        }).done(function(data) {
          shaderSources[index] = data;
          checkLoaded();
        });
      }
      getSource("shader.vsh", 0);
      getSource("shader.psh", 1);
      $enabled = true;
      return;
    }
    $enabled = !$enabled;
    $canvas.toggle($enabled);
    $orig.toggle(!$enabled);
  });
  $(".paperdoll-container").prepend(button);

})();
