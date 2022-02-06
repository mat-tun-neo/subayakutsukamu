<?php
class Room extends Base
{
    // POST値
    private $post_ary;
    // JSONディレクトリ
    private $json_dir = "./json/room/";
    // 現在時刻（UNIXミリ秒）
    private $unix_time;
    // IPアドレス
    private $ip_address;
    // 部屋情報JSONをクリア対象とするミリ秒数
    const JSON_CLR_TIME = 600 * 1000;

    // コンストラクタ
    public function __construct($post_ary)
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        //$this->debug_log("POST値", $post_ary);

        $this->classname = get_class($this);
        $this->post_ary = $post_ary;
        $this->unix_time = ceil(microtime(true)*1000);
        $this->ip_address = $_SERVER["REMOTE_ADDR"];
        // 部屋番号が未入力の場合
        if ($this->post_ary['roomno'] == null) {
            $this->post_ary['roomno'] = $this->ip_address;
        }
        // デバッグ情報
        //$this->debug_log("ip_address", $this->ip_address);
        //$this->debug_log("unix_time", $this->unix_time);
    }

    // 部屋情報作成
    public function createRoomInfo()
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        $this->debug_log("POST値", $this->post_ary);
        // JSONファイル読込
        $json_file = $this->json_dir . $this->post_ary['roomno'] . ".json";
        $json_buf = array();
        if (file_exists($json_file) && filesize($json_file) > 0) {
            $json_buf = json_decode(file_get_contents($json_file), true);
        }
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);
        // ゲームスタート済の場合の考慮が必要


        // JSONデータ更新（古いセッション情報をクリア）
        foreach ($json_buf as $key => $value) {
            // 要素クリア
            if ($this->unix_time - $value["createtimestamp"] > self::JSON_CLR_TIME) {
                // デバッグ情報
                $this->debug_log("要素クリア", ($this->unix_time - $value["createtimestamp"]));
                unset($json_buf[$key]);
            }
        }
        // JSONデータ更新
        if (!isset($json_buf[session_id()])) {
            $json_buf += array(session_id()=>$this->post_ary["sessionid"]);
        };
        $json_buf[session_id()]["createtimestamp"] = $this->unix_time;
        $json_buf[session_id()]["currenttimestamp"] = 0;
        $json_buf[session_id()]["roomno"] = $this->post_ary["roomno"];
        $json_buf[session_id()]["name"] = $this->post_ary["name"];
        $json_buf[session_id()]["id"] = session_id();
        $json_buf[session_id()]["gamestart_flg"] = 0;   // 0:スタート前、1:回答前、2:回答済
        $json_buf[session_id()]["score"] = 0;
        $json_buf[session_id()]["top_flg"] = 0;
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);
        // JSONファイル書込
        file_put_contents($json_file, json_encode($json_buf));
        // セッション情報更新
        $_SESSION["roomno"] = $this->post_ary["roomno"];
        // デバッグ情報
        $this->debug_log("session_id()", session_id());
        $this->debug_log("_SESSION", $_SESSION);
    }

    // 部屋情報取得
    public function getRoomInfo()
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        //$this->debug_log("session_id()", session_id());
        //$this->debug_log("_SESSION", $_SESSION);

        // JSONファイル読込
        $json_file = $this->json_dir . $_SESSION["roomno"]. ".json";
        $json_buf = array();
        if (file_exists($json_file) && filesize($json_file) > 0) {
            $json_buf = json_decode(file_get_contents($json_file), true);
        }
        $json_buf[session_id()]["currenttimestamp"] = $this->unix_time;
        // デバッグ情報
        //$this->debug_log("$json_file", $json_buf);
        return $json_buf;
    }

    // 部屋情報削除
    public function deleteRoomInfo()
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        $this->debug_log("session_id()", session_id());
        $this->debug_log("_SESSION", $_SESSION);
        // JSONファイル読込
        $json_file = $this->json_dir . $_SESSION["roomno"]. ".json";
        $json_buf = array();
        if (file_exists($json_file) && filesize($json_file) > 0) {
            $json_buf = json_decode(file_get_contents($json_file), true);
        }
        // JSONデータ更新
        unset($json_buf[session_id()]);
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);
        // JSONファイル書込
        file_put_contents($json_file, json_encode($json_buf));
    }

    // ゲームスタート
    public function startGame()
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        $this->debug_log("session_id()", session_id());
        $this->debug_log("_SESSION", $_SESSION);
        $this->debug_log("POST値", $this->post_ary);
        // JSONファイル読込
        $json_file = $this->json_dir . $_SESSION["roomno"]. ".json";
        $json_buf = array();
        if (file_exists($json_file) && filesize($json_file) > 0) {
            $json_buf = json_decode(file_get_contents($json_file), true);
        }
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);

        // JSONデータ更新
        foreach ($json_buf as $key => $value) {
            // ゲームスタートのフラグ
            $json_buf[$key]["gamestart_flg"] = 1;   // 0:スタート前、1:回答前、2:回答済
            $json_buf[$key]["correct"] = $this->post_ary["correct"];
            $json_buf[$key]["hint1"] = $this->post_ary["hint1"];
            $json_buf[$key]["hint2"] = $this->post_ary["hint2"];
            $json_buf[$key]["answer"] = "";
            $json_buf[$key]["top_flg"] = 1;
        }
        // JSONファイル書込
        file_put_contents($json_file, json_encode($json_buf));
        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);
    }

    // 回答ボタン押下
    public function pushAnswer()
    {
        $this->methodname = __FUNCTION__;
        // デバッグ情報
        $this->debug_log("POST値", $this->post_ary);
        // JSONファイル読込
        $json_file = $this->json_dir . $_SESSION["roomno"]. ".json";
        $json_buf = array();
        if (file_exists($json_file) && filesize($json_file) > 0) {
            $json_buf = json_decode(file_get_contents($json_file), true);
        }
        // JSONデータ更新
        if ($json_buf[session_id()]["gamestart_flg"] == 1) {    // 0:スタート前、1:回答前、2:回答済、3:再スタート
            // 回答済み
            $json_buf[session_id()]["gamestart_flg"] = 2;   // 0:スタート前、1:回答前、2:回答済、3:再スタート
            $json_buf[session_id()]["answer"] = $this->post_ary['answer']; 
            // スコア加減
            if ($json_buf[session_id()]["correct"] == $json_buf[session_id()]["answer"]) {
                // 正解者トップフラグがONの場合
                if ($json_buf[session_id()]["top_flg"] == 1) {
                    $json_buf[session_id()]["score"] += 1;
                    // JSONデータ更新
                    foreach ($json_buf as $key => $value) {
                        // 全員の正解者トップフラグをOFF
                        $json_buf[$key]["top_flg"] = 0;
                    }
                    $json_buf[session_id()]["top_flg"] = 1;
                }
            } else {
                $json_buf[session_id()]["score"] -= 1;
            }
        }
        // 全員が回答済みの場合
        $check_kaitou = true;
        foreach ($json_buf as $key => $value) {
            if ($json_buf[$key]["gamestart_flg"] != 2) {   // 0:スタート前、1:回答前、2:回答済、3:再スタート
                $check_kaitou = false;
            }
        }
        if ($check_kaitou) {
            // デバッグ情報
            $this->debug_log("全員回答済", $check_kaitou);
            foreach ($json_buf as $key => $value) {
                $json_buf[$key]["gamestart_flg"] = 3;   // 0:スタート前、1:回答前、2:回答済、3:再スタート
                $json_buf[$key]["all_answertime"] = $this->unix_time;
            }
        }
        // JSONファイル書込
        file_put_contents($json_file, json_encode($json_buf));

        // デバッグ情報
        $this->debug_log("$json_file", $json_buf);
        return $json_buf;
    }
}
?>