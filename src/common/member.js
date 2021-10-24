const Member = function (config) {
  this.name = config.name;
  this.score = 0;
  this.color = config.color;
  this.status = "ing";
  this.number = config.number;
  this.x = [];
  this.y = [];
  this.header = 1;
  this.time = 100;
};
export default Member;
