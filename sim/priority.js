(function() {
  var DC = DiabloCalc;
  var Sim = DC.Simulator;

  Sim.PriorityItem = function() {
    this.dom = {};
    this.dom.line = $("<div></div>");
    this.dom.skill = $("<select></select>");
    this.dom.skill.append("<option></option>");
  };
})();