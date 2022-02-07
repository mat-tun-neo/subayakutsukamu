// グローバルに展開
phina.globalize();

// 画面・スプライトサイズ
const SCREEN_WIDTH            = 640;
const SCREEN_HEIGHT           = 960;
const PADDING                 = 10;
const BUTTON_SIZE             = 80;
const LABEL_FONT_SIZE         = 30;
const TITLE_HEIGHT            = 100;
const START_BUTTON_WIDTH      = 150;
const START_BUTTON_HEIGHT     = 150;
const SHUTTER_WIDTH           = 640;
const SHUTTER_HEIGHT          = 640;
const HINT_CHARACTER_WIDTH    = 320;
const HINT_CHARACTER_HEIGHT   = 320;
const ANSWER_CHARACTER_WIDTH  = 128;
const ANSWER_CHARACTER_HEIGHT = 128;
const SCORE_WIDTH             = 120;
const SCORE_HEIGHT            = 100;

// URL
const HREF = document.getElementById("HTTP_REFERER").innerText;

const date = new Date();
const Y = date.getFullYear();
const M = ("00" + (date.getMonth()+1)).slice(-2);
const D = ("00" + date.getDate()).slice(-2);
const h = ("00" + date.getHours()).slice(-2);
const m = ("00" + date.getMinutes()).slice(-2);
const s = ("00" + date.getSeconds()).slice(-2);
const datestr = "?" + Y + M + D + h + m + s;

// 各セッティング値
const UPDATE_FRAME = 10;          // 同期フレーム
const LOCATE_RANGE_MIN = -120;    // ヒントキャラの表示範囲 MIN
const LOCATE_RANGE_MAX = 120;     // ヒントキャラの表示範囲 MAX
const SCALE_RANGE_MAX = 2;        // ヒントキャラの拡大率 MAX
const SCALE_RANGE_MIN = 0.3;      // ヒントキャラの拡大率 MIN
const TIME_TO_NEXTGAME = 5*1000;  // 次ゲームまでの待機時間(ms)
const CORRECT_RATE                // correct_XXX_YYY が正解となる確率
   = document.getElementById("correct_rate").innerText;          

// 難易度設定値
//  open ：シャッターが開いている時間（ms）
//  close：シャッターが閉じている時間（ms）
const DIFFICULTY = {
  EASY  : { open: 9 * 1000, close: 1 * 1000, image:"000", message:"" },
  NORMAL: { open: 5 * 1000, close: 5 * 1000, image:"001", message:"" },
  HARD  : { open: 1 * 1000, close: 9 * 1000, image:"002", message:"" }
};

// キャラクター番号
const CHARACTER_NO = {
  "000": { spritesheet: "correct_white_kuma",    color: "white",  character: "kuma",   correct: "011", wrong: "017" },
  "001": { spritesheet: "correct_blue_iruka",    color: "blue",   character: "iruka",  correct: "007", wrong: "012" },
  "002": { spritesheet: "correct_green_suika",   color: "green",  character: "suika",  correct: "004", wrong: "008" },
  "003": { spritesheet: "correct_red_ichigo",    color: "red",    character: "ichigo", correct: "010", wrong: "007" },
  "004": { spritesheet: "correct_yellow_banana", color: "yellow", character: "banana", correct: "010", wrong: "007" }
}

// アセット
const ASSETS = {
  // 画像
  image: {
    "window":                 "./images/window.png" + datestr,
    "shutter":                "./images/shutter.png" + datestr,
    "start_button":           "./images/startbutton.png" + datestr,
    "sankasya_bosyu":         "./images/sankasya_bosyu.png" + datestr,
    "xbutton":                "./images/xbutton.png" + datestr,
    "difficulty":             "./images/difficulty.png" + datestr,
    "score":                  "./images/score.png" + datestr,
    "correct_blue_iruka":     "./images/correct_blue_iruka.png" + datestr,
    "correct_green_suika":    "./images/correct_green_suika.png" + datestr,
    "correct_red_ichigo":     "./images/correct_red_ichigo.png" + datestr,
    "correct_white_kuma":     "./images/correct_white_kuma.png" + datestr,
    "correct_yellow_banana":  "./images/correct_yellow_banana.png" + datestr,
    "wrong_blue_banana":      "./images/wrong_blue_banana.png" + datestr,
    "wrong_blue_ichigo":      "./images/wrong_blue_ichigo.png" + datestr,
    "wrong_blue_kuma":        "./images/wrong_blue_kuma.png" + datestr,
    "wrong_blue_suika":       "./images/wrong_blue_suika.png" + datestr,
    "wrong_green_banana":     "./images/wrong_green_banana.png" + datestr,
    "wrong_green_ichigo":     "./images/wrong_green_ichigo.png" + datestr,
    "wrong_green_iruka":      "./images/wrong_green_iruka.png" + datestr,
    "wrong_green_kuma":       "./images/wrong_green_kuma.png" + datestr,
    "wrong_red_banana":       "./images/wrong_red_banana.png" + datestr,
    "wrong_red_iruka":        "./images/wrong_red_iruka.png" + datestr,
    "wrong_red_kuma":         "./images/wrong_red_kuma.png" + datestr,
    "wrong_red_suika":        "./images/wrong_red_suika.png" + datestr,
    "wrong_white_banana":     "./images/wrong_white_banana.png" + datestr,
    "wrong_white_ichigo":     "./images/wrong_white_ichigo.png" + datestr,
    "wrong_white_iruka":      "./images/wrong_white_iruka.png" + datestr,
    "wrong_white_suika":      "./images/wrong_white_suika.png" + datestr,
    "wrong_yellow_ichigo":    "./images/wrong_yellow_ichigo.png" + datestr,
    "wrong_yellow_iruka":     "./images/wrong_yellow_iruka.png" + datestr,
    "wrong_yellow_kuma":      "./images/wrong_yellow_kuma.png" + datestr,
    "wrong_yellow_suika":     "./images/wrong_yellow_suika.png" + datestr
  },
  // スプライトシート
  spritesheet: {
    "start_button":
    {
      "frame": { "width": 300, "height": 300, "cols": 2, "rows": 1 },
      "animations" : {
        "000": {"frames": [0, 1] , "next": "000", "frequency": 15 }
      }
    },
    "sankasya_bosyu":
    {
      "frame": { "width": 600, "height": 431, "cols": 1, "rows": 1 },
      "animations" : {
        "000": {"frames": [0], "next": "000", "frequency": 1 }
      }
    },
    "shutter":
    {
      "frame": { "width": 500, "height": 500, "cols": 5, "rows": 2 },
      "animations" : {
        "CLOSE2OPEN": {"frames": [1,2,3,4,5,6,7], "next": "OPEN" , "frequency": 1 },
        "OPEN2CLOSE": {"frames": [7,6,5,4,3,2,1], "next": "CLOSE", "frequency": 1 },
        "OPEN"      : {"frames": [8],             "next": "OPEN" , "frequency": 1 },
        "CLOSE"     : {"frames": [0],             "next": "CLOSE", "frequency": 1 }
      }
    },
    "difficulty":
    {
      "frame": { "width": 340, "height": 340, "cols": 3, "rows": 1 },
      "animations" : {
        "000" : {"frames": [0], "next": "000", "frequency": 1 },
        "001" : {"frames": [1], "next": "001", "frequency": 1 },
        "002" : {"frames": [2], "next": "002", "frequency": 1 }
      }
    },
    "score":
    {
      "frame": { "width": 240, "height": 200, "cols": 10, "rows": 11 },
      "animations" : {
        "000" : {"frames": [0],  "next": "000", "frequency": 1 },
        "001" : {"frames": [1],  "next": "001", "frequency": 1 },
        "002" : {"frames": [2],  "next": "002", "frequency": 1 },
        "003" : {"frames": [3],  "next": "003", "frequency": 1 },
        "004" : {"frames": [4],  "next": "004", "frequency": 1 },
        "005" : {"frames": [5],  "next": "005", "frequency": 1 },
        "006" : {"frames": [6],  "next": "006", "frequency": 1 },
        "007" : {"frames": [7],  "next": "007", "frequency": 1 },
        "008" : {"frames": [8],  "next": "008", "frequency": 1 },
        "009" : {"frames": [9],  "next": "009", "frequency": 1 },
        "010" : {"frames": [10], "next": "010", "frequency": 1 },
        "011" : {"frames": [11], "next": "011", "frequency": 1 },
        "012" : {"frames": [12], "next": "012", "frequency": 1 },
        "013" : {"frames": [13], "next": "013", "frequency": 1 },
        "014" : {"frames": [14], "next": "014", "frequency": 1 },
        "015" : {"frames": [15], "next": "015", "frequency": 1 },
        "016" : {"frames": [16], "next": "016", "frequency": 1 },
        "017" : {"frames": [17], "next": "017", "frequency": 1 },
        "018" : {"frames": [18], "next": "018", "frequency": 1 },
        "019" : {"frames": [19], "next": "019", "frequency": 1 },
        "020" : {"frames": [20], "next": "020", "frequency": 1 },
        "021" : {"frames": [21], "next": "021", "frequency": 1 },
        "022" : {"frames": [22], "next": "022", "frequency": 1 },
        "023" : {"frames": [23], "next": "023", "frequency": 1 },
        "024" : {"frames": [24], "next": "024", "frequency": 1 },
        "025" : {"frames": [25], "next": "025", "frequency": 1 },
        "026" : {"frames": [26], "next": "026", "frequency": 1 },
        "027" : {"frames": [27], "next": "027", "frequency": 1 },
        "028" : {"frames": [28], "next": "028", "frequency": 1 },
        "029" : {"frames": [29], "next": "029", "frequency": 1 },
        "030" : {"frames": [30], "next": "030", "frequency": 1 },
        "031" : {"frames": [31], "next": "031", "frequency": 1 },
        "032" : {"frames": [32], "next": "032", "frequency": 1 },
        "033" : {"frames": [33], "next": "033", "frequency": 1 },
        "034" : {"frames": [34], "next": "034", "frequency": 1 },
        "035" : {"frames": [35], "next": "035", "frequency": 1 },
        "036" : {"frames": [36], "next": "036", "frequency": 1 },
        "037" : {"frames": [37], "next": "037", "frequency": 1 },
        "038" : {"frames": [38], "next": "038", "frequency": 1 },
        "039" : {"frames": [39], "next": "039", "frequency": 1 },
        "040" : {"frames": [40], "next": "040", "frequency": 1 },
        "041" : {"frames": [41], "next": "041", "frequency": 1 },
        "042" : {"frames": [42], "next": "042", "frequency": 1 },
        "043" : {"frames": [43], "next": "043", "frequency": 1 },
        "044" : {"frames": [44], "next": "044", "frequency": 1 },
        "045" : {"frames": [45], "next": "045", "frequency": 1 },
        "046" : {"frames": [46], "next": "046", "frequency": 1 },
        "047" : {"frames": [47], "next": "047", "frequency": 1 },
        "048" : {"frames": [48], "next": "048", "frequency": 1 },
        "049" : {"frames": [49], "next": "049", "frequency": 1 },
        "050" : {"frames": [50], "next": "050", "frequency": 1 },
        "051" : {"frames": [51], "next": "051", "frequency": 1 },
        "052" : {"frames": [52], "next": "052", "frequency": 1 },
        "053" : {"frames": [53], "next": "053", "frequency": 1 },
        "054" : {"frames": [54], "next": "054", "frequency": 1 },
        "055" : {"frames": [55], "next": "055", "frequency": 1 },
        "056" : {"frames": [56], "next": "056", "frequency": 1 },
        "057" : {"frames": [57], "next": "057", "frequency": 1 },
        "058" : {"frames": [58], "next": "058", "frequency": 1 },
        "059" : {"frames": [59], "next": "059", "frequency": 1 },
        "060" : {"frames": [60], "next": "060", "frequency": 1 },
        "061" : {"frames": [61], "next": "061", "frequency": 1 },
        "062" : {"frames": [62], "next": "062", "frequency": 1 },
        "063" : {"frames": [63], "next": "063", "frequency": 1 },
        "064" : {"frames": [64], "next": "064", "frequency": 1 },
        "065" : {"frames": [65], "next": "065", "frequency": 1 },
        "066" : {"frames": [66], "next": "066", "frequency": 1 },
        "067" : {"frames": [67], "next": "067", "frequency": 1 },
        "068" : {"frames": [68], "next": "068", "frequency": 1 },
        "069" : {"frames": [69], "next": "069", "frequency": 1 },
        "070" : {"frames": [70], "next": "070", "frequency": 1 },
        "071" : {"frames": [71], "next": "071", "frequency": 1 },
        "072" : {"frames": [72], "next": "072", "frequency": 1 },
        "073" : {"frames": [73], "next": "073", "frequency": 1 },
        "074" : {"frames": [74], "next": "074", "frequency": 1 },
        "075" : {"frames": [75], "next": "075", "frequency": 1 },
        "076" : {"frames": [76], "next": "076", "frequency": 1 },
        "077" : {"frames": [77], "next": "077", "frequency": 1 },
        "078" : {"frames": [78], "next": "078", "frequency": 1 },
        "079" : {"frames": [79], "next": "079", "frequency": 1 },
        "080" : {"frames": [80], "next": "080", "frequency": 1 },
        "081" : {"frames": [81], "next": "081", "frequency": 1 },
        "082" : {"frames": [82], "next": "082", "frequency": 1 },
        "083" : {"frames": [83], "next": "083", "frequency": 1 },
        "084" : {"frames": [84], "next": "084", "frequency": 1 },
        "085" : {"frames": [85], "next": "085", "frequency": 1 },
        "086" : {"frames": [86], "next": "086", "frequency": 1 },
        "087" : {"frames": [87], "next": "087", "frequency": 1 },
        "088" : {"frames": [88], "next": "088", "frequency": 1 },
        "089" : {"frames": [89], "next": "089", "frequency": 1 },
        "090" : {"frames": [90], "next": "090", "frequency": 1 },
        "091" : {"frames": [91], "next": "091", "frequency": 1 },
        "092" : {"frames": [92], "next": "092", "frequency": 1 },
        "093" : {"frames": [93], "next": "093", "frequency": 1 },
        "094" : {"frames": [94], "next": "094", "frequency": 1 },
        "095" : {"frames": [95], "next": "095", "frequency": 1 },
        "096" : {"frames": [96], "next": "096", "frequency": 1 },
        "097" : {"frames": [97], "next": "097", "frequency": 1 },
        "098" : {"frames": [98], "next": "098", "frequency": 1 },
        "099" : {"frames": [99], "next": "099", "frequency": 1 },
        "-1"  : {"frames": [101], "next": "-1", "frequency": 1 },
        "-2"  : {"frames": [102], "next": "-2", "frequency": 1 },
        "-3"  : {"frames": [103], "next": "-3", "frequency": 1 },
        "-4"  : {"frames": [104], "next": "-4", "frequency": 1 },
        "-5"  : {"frames": [105], "next": "-5", "frequency": 1 },
        "-6"  : {"frames": [106], "next": "-6", "frequency": 1 },
        "-7"  : {"frames": [107], "next": "-7", "frequency": 1 },
        "-8"  : {"frames": [108], "next": "-8", "frequency": 1 },
        "-9"  : {"frames": [109], "next": "-9", "frequency": 1 }
      }
    },
    "correct_blue_iruka"   : {},
    "correct_green_suika"  : {},
    "correct_red_ichigo"   : {},
    "correct_white_kuma"   : {},
    "correct_yellow_banana": {},
    "wrong_white_suika"    : {},
    "wrong_white_iruka"    : {},
    "wrong_white_ichigo"   : {},
    "wrong_white_banana"   : {},
    "wrong_green_kuma"     : {},
    "wrong_green_iruka"    : {},
    "wrong_green_ichigo"   : {},
    "wrong_green_banana"   : {},
    "wrong_blue_kuma"      : {},
    "wrong_blue_suika"     : {},
    "wrong_blue_ichigo"    : {},
    "wrong_blue_banana"    : {},
    "wrong_red_kuma"       : {},
    "wrong_red_suika"      : {},
    "wrong_red_iruka"      : {},
    "wrong_red_banana"     : {},
    "wrong_yellow_kuma"    : {},
    "wrong_yellow_suika"   : {},
    "wrong_yellow_iruka"   : {},
    "wrong_yellow_ichigo"  : {}
  }
};

let iruka = {
  "frame": { "width": 256, "height": 256, "cols": 5, "rows": 4 },
  "animations" : {
    "000" : {"frames": [0],  "next": "000", "frequency": 1 },
    "001" : {"frames": [1],  "next": "001", "frequency": 1 },
    "002" : {"frames": [2],  "next": "002", "frequency": 1 },
    "003" : {"frames": [3],  "next": "003", "frequency": 1 },
    "004" : {"frames": [4],  "next": "004", "frequency": 1 },
    "005" : {"frames": [5],  "next": "005", "frequency": 1 },
    "006" : {"frames": [6],  "next": "006", "frequency": 1 },
    "007" : {"frames": [7],  "next": "007", "frequency": 1 },
    "008" : {"frames": [8],  "next": "008", "frequency": 1 },
    "009" : {"frames": [9],  "next": "009", "frequency": 1 },
    "010" : {"frames": [10], "next": "010", "frequency": 1 },
    "011" : {"frames": [11], "next": "011", "frequency": 1 },
    "012" : {"frames": [12], "next": "012", "frequency": 1 },
    "013" : {"frames": [13], "next": "013", "frequency": 1 },
    "014" : {"frames": [14], "next": "014", "frequency": 1 },
    "015" : {"frames": [15], "next": "015", "frequency": 1 },
    "016" : {"frames": [16], "next": "016", "frequency": 1 },
    "017" : {"frames": [17], "next": "017", "frequency": 1 },
    "018" : {"frames": [18], "next": "018", "frequency": 1 },
    "019" : {"frames": [19], "next": "019", "frequency": 1 }
  }
}

let suika = {
  "frame": { "width": 256, "height": 256, "cols": 5, "rows": 4 },
  "animations" : {
    "000" : {"frames": [0],  "next": "000", "frequency": 1 },
    "001" : {"frames": [1],  "next": "001", "frequency": 1 },
    "002" : {"frames": [2],  "next": "002", "frequency": 1 },
    "003" : {"frames": [3],  "next": "003", "frequency": 1 },
    "004" : {"frames": [4],  "next": "004", "frequency": 1 },
    "005" : {"frames": [5],  "next": "005", "frequency": 1 },
    "006" : {"frames": [6],  "next": "006", "frequency": 1 },
    "007" : {"frames": [7],  "next": "007", "frequency": 1 },
    "008" : {"frames": [8],  "next": "008", "frequency": 1 },
    "009" : {"frames": [9],  "next": "009", "frequency": 1 },
    "010" : {"frames": [10], "next": "010", "frequency": 1 },
    "011" : {"frames": [11], "next": "011", "frequency": 1 },
    "012" : {"frames": [12], "next": "012", "frequency": 1 },
    "013" : {"frames": [13], "next": "013", "frequency": 1 },
    "014" : {"frames": [14], "next": "014", "frequency": 1 },
    "015" : {"frames": [15], "next": "015", "frequency": 1 },
    "016" : {"frames": [16], "next": "016", "frequency": 1 },
    "017" : {"frames": [17], "next": "017", "frequency": 1 },
    "018" : {"frames": [18], "next": "018", "frequency": 1 },
    "019" : {"frames": [19], "next": "019", "frequency": 1 },
    "020" : {"frames": [20], "next": "020", "frequency": 1 }
  }
}

let ichigo = {
  "frame": { "width": 256, "height": 256, "cols": 5, "rows": 4 },
  "animations" : {
    "000" : {"frames": [0],  "next": "000", "frequency": 1 },
    "001" : {"frames": [1],  "next": "001", "frequency": 1 },
    "002" : {"frames": [2],  "next": "002", "frequency": 1 },
    "003" : {"frames": [3],  "next": "003", "frequency": 1 },
    "004" : {"frames": [4],  "next": "004", "frequency": 1 },
    "005" : {"frames": [5],  "next": "005", "frequency": 1 },
    "006" : {"frames": [6],  "next": "006", "frequency": 1 },
    "007" : {"frames": [7],  "next": "007", "frequency": 1 },
    "008" : {"frames": [8],  "next": "008", "frequency": 1 },
    "009" : {"frames": [9],  "next": "009", "frequency": 1 },
    "010" : {"frames": [10], "next": "010", "frequency": 1 },
    "011" : {"frames": [11], "next": "011", "frequency": 1 },
    "012" : {"frames": [12], "next": "012", "frequency": 1 },
    "013" : {"frames": [13], "next": "013", "frequency": 1 },
    "014" : {"frames": [14], "next": "014", "frequency": 1 },
    "015" : {"frames": [15], "next": "015", "frequency": 1 },
    "016" : {"frames": [16], "next": "016", "frequency": 1 },
    "017" : {"frames": [17], "next": "017", "frequency": 1 },
    "018" : {"frames": [18], "next": "018", "frequency": 1 },
    "019" : {"frames": [19], "next": "019", "frequency": 1 }
  }
}

let kuma = {
  "frame": { "width": 256, "height": 256, "cols": 5, "rows": 7 },
  "animations" : {
    "000" : {"frames": [0],  "next": "000", "frequency": 1 },
    "001" : {"frames": [1],  "next": "001", "frequency": 1 },
    "002" : {"frames": [2],  "next": "002", "frequency": 1 },
    "003" : {"frames": [3],  "next": "003", "frequency": 1 },
    "004" : {"frames": [4],  "next": "004", "frequency": 1 },
    "005" : {"frames": [5],  "next": "005", "frequency": 1 },
    "006" : {"frames": [6],  "next": "006", "frequency": 1 },
    "007" : {"frames": [7],  "next": "007", "frequency": 1 },
    "008" : {"frames": [8],  "next": "008", "frequency": 1 },
    "009" : {"frames": [9],  "next": "009", "frequency": 1 },
    "010" : {"frames": [10], "next": "010", "frequency": 1 },
    "011" : {"frames": [11], "next": "011", "frequency": 1 },
    "012" : {"frames": [12], "next": "012", "frequency": 1 },
    "013" : {"frames": [13], "next": "013", "frequency": 1 },
    "014" : {"frames": [14], "next": "014", "frequency": 1 },
    "015" : {"frames": [15], "next": "015", "frequency": 1 },
    "016" : {"frames": [16], "next": "016", "frequency": 1 },
    "017" : {"frames": [17], "next": "017", "frequency": 1 },
    "018" : {"frames": [18], "next": "018", "frequency": 1 },
    "019" : {"frames": [19], "next": "019", "frequency": 1 },
    "020" : {"frames": [20], "next": "020", "frequency": 1 },
    "021" : {"frames": [21], "next": "021", "frequency": 1 },
    "022" : {"frames": [22], "next": "022", "frequency": 1 },
    "023" : {"frames": [23], "next": "023", "frequency": 1 },
    "024" : {"frames": [24], "next": "024", "frequency": 1 },
    "025" : {"frames": [25], "next": "025", "frequency": 1 },
    "026" : {"frames": [26], "next": "026", "frequency": 1 },
    "027" : {"frames": [27], "next": "027", "frequency": 1 },
    "028" : {"frames": [28], "next": "028", "frequency": 1 },
    "029" : {"frames": [29], "next": "029", "frequency": 1 },
    "030" : {"frames": [30], "next": "030", "frequency": 1 },
    "031" : {"frames": [31], "next": "031", "frequency": 1 },
    "032" : {"frames": [32], "next": "032", "frequency": 1 },
    "033" : {"frames": [33], "next": "033", "frequency": 1 },
    "034" : {"frames": [34], "next": "034", "frequency": 1 }
  }
}

let banana = {
  "frame": { "width": 256, "height": 256, "cols": 5, "rows": 4 },
  "animations" : {
    "000" : {"frames": [0],  "next": "000", "frequency": 1 },
    "001" : {"frames": [1],  "next": "001", "frequency": 1 },
    "002" : {"frames": [2],  "next": "002", "frequency": 1 },
    "003" : {"frames": [3],  "next": "003", "frequency": 1 },
    "004" : {"frames": [4],  "next": "004", "frequency": 1 },
    "005" : {"frames": [5],  "next": "005", "frequency": 1 },
    "006" : {"frames": [6],  "next": "006", "frequency": 1 },
    "007" : {"frames": [7],  "next": "007", "frequency": 1 },
    "008" : {"frames": [8],  "next": "008", "frequency": 1 },
    "009" : {"frames": [9],  "next": "009", "frequency": 1 },
    "010" : {"frames": [10], "next": "010", "frequency": 1 },
    "011" : {"frames": [11], "next": "011", "frequency": 1 },
    "012" : {"frames": [12], "next": "012", "frequency": 1 },
    "013" : {"frames": [13], "next": "013", "frequency": 1 },
    "014" : {"frames": [14], "next": "014", "frequency": 1 },
    "015" : {"frames": [15], "next": "015", "frequency": 1 },
    "016" : {"frames": [16], "next": "016", "frequency": 1 },
    "017" : {"frames": [17], "next": "017", "frequency": 1 },
    "018" : {"frames": [18], "next": "018", "frequency": 1 },
    "019" : {"frames": [19], "next": "019", "frequency": 1 }
  }
}

ASSETS.spritesheet["correct_blue_iruka"   ] = iruka;
ASSETS.spritesheet["correct_green_suika"  ] = suika;
ASSETS.spritesheet["correct_red_ichigo"   ] = ichigo;
ASSETS.spritesheet["correct_white_kuma"   ] = kuma;
ASSETS.spritesheet["correct_yellow_banana"] = banana;
ASSETS.spritesheet["wrong_white_suika"    ] = suika;
ASSETS.spritesheet["wrong_white_iruka"    ] = iruka;
ASSETS.spritesheet["wrong_white_ichigo"   ] = ichigo;
ASSETS.spritesheet["wrong_white_banana"   ] = banana;
ASSETS.spritesheet["wrong_green_kuma"     ] = kuma;
ASSETS.spritesheet["wrong_green_iruka"    ] = iruka;
ASSETS.spritesheet["wrong_green_ichigo"   ] = ichigo;
ASSETS.spritesheet["wrong_green_banana"   ] = banana;
ASSETS.spritesheet["wrong_blue_kuma"      ] = kuma;
ASSETS.spritesheet["wrong_blue_suika"     ] = suika;
ASSETS.spritesheet["wrong_blue_ichigo"    ] = ichigo;
ASSETS.spritesheet["wrong_blue_banana"    ] = banana;
ASSETS.spritesheet["wrong_red_kuma"       ] = kuma;
ASSETS.spritesheet["wrong_red_suika"      ] = suika;
ASSETS.spritesheet["wrong_red_iruka"      ] = iruka;
ASSETS.spritesheet["wrong_red_banana"     ] = banana;
ASSETS.spritesheet["wrong_yellow_kuma"    ] = kuma;
ASSETS.spritesheet["wrong_yellow_suika"   ] = suika;
ASSETS.spritesheet["wrong_yellow_iruka"   ] = iruka;
ASSETS.spritesheet["wrong_yellow_ichigo"  ] = ichigo;

// 0パディング（NUM=値 LEN=桁数）
function zeroPadding(NUM, LEN) {
  if (NUM > -1) {
	  return ( Array(LEN).join("0") + NUM ).slice( -LEN );
  } else {
    return NUM;
  }
};

// 文字列挿入
function strIns(str, idx, val) {
  return str.slice(0, idx) + val + str.slice(idx);
}

// 配列ランダムソート（シャッフル）関数
function shuffleArray(arr) {
    var n = arr.length;
    var temp = 0, i = 0;
    while (n) {
        i = Math.floor(Math.random() * n--);
        temp = arr[n];
        arr[n] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

// 乱数
const rand = (from, to) =>
  ~~(from + Math.random() * (to - from + 1))

// 回答作成
function makeAnswer() {
  let post_data = {
    "correct": "",
    "hint1": { "spritesheet": "", "animations": "", "size": 1, "x": 0, "y": 0 },
    "hint2": { "spritesheet": "", "animations": "", "size": 1, "x": 0, "y": 0 }
  };
  let keys = Object.keys(CHARACTER_NO);
  shuffleArray(keys);
  console.log("keys", keys);
  
  // 回答
  post_data["correct"] = keys[0];

  // サイズスケール（乱数）　手前側が小さくなるようにする
  let size1 = Math.random() * SCALE_RANGE_MAX + SCALE_RANGE_MIN;
  let size2 = Math.random() * SCALE_RANGE_MAX + SCALE_RANGE_MIN;
  if (size1 < size2) {
    let buf = size1;
    size1 = size2;
    size2 = buf;
  } 

  // ヒント1
  keys.shift();
  tmp = CHARACTER_NO[keys[0]].color;
  keys.shift();
  hint1_spritesheet = "wrong_" + tmp + "_" + CHARACTER_NO[keys[0]].character;
  arrayno = zeroPadding(Math.floor(Math.random()*Object.keys(ASSETS.spritesheet[hint1_spritesheet].animations).length), 3);
  post_data["hint1"]["spritesheet"] = hint1_spritesheet;
  post_data["hint1"]["animations"]  = arrayno
  post_data["hint1"]["size"]        = size1;
  post_data["hint1"]["x"]           = rand(LOCATE_RANGE_MIN, LOCATE_RANGE_MAX);
  post_data["hint1"]["y"]           = rand(LOCATE_RANGE_MIN, LOCATE_RANGE_MAX);
  //console.log("arrayno", arrayno);

  // ヒント2
  keys.shift();
  tmp = CHARACTER_NO[keys[0]].color;
  keys.shift();
  if (Math.random() < CORRECT_RATE) {
    hint2_spritesheet = CHARACTER_NO[post_data["correct"]].spritesheet;
  } else {
    hint2_spritesheet = "wrong_" + tmp + "_" + CHARACTER_NO[keys[0]].character;
  }
  arrayno = zeroPadding(Math.floor(Math.random()*Object.keys(ASSETS.spritesheet[hint2_spritesheet].animations).length), 3);
  post_data["hint2"]["spritesheet"] = hint2_spritesheet;
  post_data["hint2"]["animations"]  = arrayno
  post_data["hint2"]["size"]        = size2;
  post_data["hint2"]["x"]           = rand(LOCATE_RANGE_MIN, LOCATE_RANGE_MAX);
  post_data["hint2"]["y"]           = rand(LOCATE_RANGE_MIN, LOCATE_RANGE_MAX);
  keys.shift();

  return post_data;
}

// シャッター開閉制御
function controlShutter(shutter, currenttimestamp) {
    // シャッター描画（開く）
    if (shutter.status == "CLOSE") {
      //console.log("(CLOSE) currenttimestamp/shutter.updatetimestamp/dom", currenttimestamp, shutter.updatetimestamp, DIFFICULTY[document.getElementById("difficulty").innerText].close);
      if (currenttimestamp - shutter.updatetimestamp > DIFFICULTY[document.getElementById("difficulty").innerText].close) {
        shutter.open(currenttimestamp);
      }
    }
    // シャッター描画（閉じる）
    if (shutter.status == "OPEN") {
      //console.log("(OPEN) currenttimestamp/shutter.updatetimestamp/dom", currenttimestamp, shutter.updatetimestamp, DIFFICULTY[document.getElementById("difficulty").innerText].open);
      if (currenttimestamp - shutter.updatetimestamp > DIFFICULTY[document.getElementById("difficulty").innerText].open) {
        shutter.close(currenttimestamp);
      }
    }
}

/*
 * メイン処理
 */
phina.main(function() {
  console.log("main");
  // アプリケーションを生成
  var app = GameApp({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS,
  });
  // fps表示
  //app.enableStats();
  // 実行
  app.replaceScene(SceneSequence());
  app.run();
});

// SceneSequenceクラス
phina.define("SceneSequence", {
  superClass: "phina.game.ManagerScene",

  // 初期化
  init: function() {
    console.log("SceneSequenceクラスinit");
    this.superInit({
      scenes: [
        { label: "Loading", className: "SceneLoading" },
        { label: "Main",    className: "SceneMain" },
        { label: "Game",    className: "SceneGame" },
        { label: "Exit",    className: "SceneExit" }
      ]
    });
  }
});
  
phina.define("SceneLoading", {
  superClass: "phina.game.LoadingScene",

  init: function(options) {
    console.log("SceneLoadingクラスinit");

    this.superInit({
      // アセット読み込み
      assets: ASSETS,
    });

    this.backgroundColor = "BLACK";

    // view
    var baseLayer = DisplayElement(options).addChildTo(this);

    // ラベル
    var label = Label({
      text: "NOW LOADING...",
    })
    .addChildTo(baseLayer)
    .setPosition(this.width*0.5, this.height*0.5)
    label.tweener.clear()
    .setLoop(1)
    .to({alpha:0}, 500)
    .to({alpha:1}, 500)
    ;
    label.fill = "white";
    label.fontSize = 40;

    this.exit("Main");
  }
});
