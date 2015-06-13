var wrk = new Worker("/sim");
var result = [];
wrk.onmessage = function(e) {
  if (e.data.type != "chart") {
    console.timeEnd("sim");
    for (var i = 0; i < result.length; ++i) {
      console.log(result[i]);
    }
    console.log(e.data);
  } else {
    result.push(e.data);
    //console.log(e.data);
  }
}
function _run() {
// Jaetch
  var stats = {
    "info": {
      "level": 70,
      "gems": 10,
      "mainhand": {
        "speed": 1.498,
        "ias": 7,
        "wpnphy": {
          "min": 1655,
          "max": 2156
        },
        "damage": 10,
        "type": "wand",
        "slot": "onehand"
      },
      "sets": {
        "talrasha": 6,
        "bastionsofwill": 2
      },
      "itemregen": 10728.42,
      "mhelement": "lit"
    },
    "charClass": "demonhunter",
    "primary": "int",
    "str": 77,
    "dex":77,
    "int": 11749,
    "vit": 2615,
    "chc": 61,
    "chd": 555,
    "ias": 78,
    "gems": {
      "enforcer": 72,
      "trapped": 74,
      "zei": 73
    },
    "special": {
      "dmgtaken": [
        {"percent": 30},
        {"percent": 30},
        {"percent": 10},
        {"percent": 10},
        {"percent": 15},
        {"percent": 15},
        {"percent": 20},
        {"percent": 20}
      ],
      "damage": [
        {"percent": 30},
        {"percent": 30}
      ]
    },
    "skills": {
      "electrocute": "d",
      "meteor": "d",
      "hydra": "d",
      "blizzard": "d",
      "slowtime": "e",
      "magicweapon": "c",
      "hungeringarrow": "c",
    },
    "passives": {
      "conflagration": true,
      "elementalexposure": true,
      "arcanedynamo": true,
      "prodigy": true
    },
    "maxap": 127,
    "apregen": 10,
    "skill_wizard_meteor": 30,
    "rescol": 503,
    "expadd": 475,
    "basearmor": 4727,
    "sockets": 10,
    "cdr": 21.25,
    "armor": 1213,
    "skill_wizard_hydra": 45,
    "resphy": 186,
    "leg_pauldronsoftheskeletonking": 1,
    "respsn": 395,
    "hitblind": 5.5,
    "resall": 502,
    "life": 40,
    "laek": 12441,
    "gf": 118,
    "leg_taskerandtheo": 49,
    "dmgfir": 19,
    "resfir": 177,
    "reslit": 176,
    "ms": 25,
    "healbonus": 35285,
    "leg_nilfursboast": 192,
    "thorns": 1825,
    "dmgmul": 4.8967900000000002,
    "ccr": 36,
    "leg_serpentssparker": 1,
    "wpnphy": {
      "min": 358,
      "max": 425
    },
    "apoc": 4,
    "set_talrasha_2pc": 1,
    "set_talrasha_4pc": 1,
    "set_talrasha_6pc": 1,
    "set_bastionsofwill_2pc": 1,
    "armor_percent": 25,
    "regen": 10728.42,
    "area": 50,
    "rcr": 10,
    "lph": 8046.299999999999,
    "dmgtaken": 150,
    "petias": 20,
    "extrams": 20,
    "damage": 60,
    "chctaken": 20
  };
  var params = {showElites: true, targetDistance: 40, targetBoss: 1, targetRadius: 0, targetSize: 2.5, targetCount: 1};
  var priority = [{skill: "hungeringarrow", conditions: []}];//[{"skill":"hydra","conditions":[{"type":"buff","lhs":"arcanedynamo","op":"ge","rhs":5},{"type":"buff","lhs":"tal_6pc_fire","op":"eq","rhs":0}]},{"skill":"meteor","conditions":[{"type":"buff","lhs":"arcanedynamo","op":"ge","rhs":5},{"type":"buff","lhs":"tal_6pc","op":"ge","rhs":3},{"type":"any","lhs":"chilled","rhs":null,"sub":[{"type":"buff","lhs":"tal_6pc_arcane","op":"eq","rhs":0},{"type":"resourcepct","lhs":"ap","op":"ge","rhs":95},{"type":"all","lhs":"chilled","rhs":null,"sub":[{"type":"buffmax","lhs":"tal_6pc","op":"lt","rhs":1.5},{"type":"buffmax","lhs":"tal_6pc","op":"gt","rhs":1.25},{"type":"resourcepct","lhs":"ap","op":"ge","rhs":50}]}]}]},{"skill":"slowtime","conditions":[{"type":"buff","lhs":"slowtime","op":"eq","rhs":0}]},{"skill":"blizzard","conditions":[{"type":"buff","lhs":"tal_6pc_cold","op":"eq","rhs":0}]},{"skill":"electrocute","conditions":[]}];
  console.time("sim");
  wrk.postMessage({
    type: "start",
    stats: stats,
    params: params,
    priority: priority,
  });
}
