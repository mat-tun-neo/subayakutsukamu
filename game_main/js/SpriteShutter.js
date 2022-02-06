phina.define("SpriteShutter", {
  superClass: "SpriteBase",

  // コンストラクタ
  init: function(updatetimestamp) {
    //console.log("SpriteShutterクラスinit");
    this.superInit("shutter", "CLOSE", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SHUTTER_WIDTH, SHUTTER_HEIGHT);
    this.status = "CLOSE";
    this.updatetimestamp = updatetimestamp;
  },
  // スプライトパターン変更
  open: function(updatetimestamp) {
    //console.log("SpriteShutterクラスopen");
    if (this.status == "CLOSE") {
      this.changeAnimation("shutter", "CLOSE2OPEN");
    }
    this.status = "OPEN";
    this.updatetimestamp = updatetimestamp;
  },
  close: function(updatetimestamp) {
    //console.log("SpriteShutterクラスclose");
    if (this.status == "OPEN") {
      this.changeAnimation("shutter", "OPEN2CLOSE");
    }
    this.status = "CLOSE";
    this.updatetimestamp = updatetimestamp;
  }
});