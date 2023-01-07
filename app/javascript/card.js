const pay = () => {
  //環境変数をもとに公開鍵を呼び出す
  const payjp = Payjp(process.env.PAYJP_PUBLIC_KEY); 
  //elementsインスタンスを生成
  const elements = payjp.elements();
  //入力欄ごとにelementインスタンスを生成
  const numberElement = elements.create('cardNumber')
  const cvcElement = elements.create('cardCvc')
  const expiryElement = elements.create('cardExpiry')
  //入力欄をブラウザ上に表示
  numberElement.mount('#number')
  cvcElement.mount('#cvc') 
  expiryElement.mount('#exp-date')
  //フォームの要素を取得
  const form = document.getElementById("charge-form");
  //PAY.JPと通信が成功した場合のみトークンをフォームに埋め込む
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    payjp.createToken(expiryElement).then((response) => {
      if (response.error) {
      }
        const token = response.id;
        const renderDom = document.getElementById("charge-form"); 
        const tokenObj = `<input value=${token} name='token' type="hidden"> `;
        renderDom.insertAdjacentHTML("beforeend", tokenObj);
        document.getElementById("charge-form").submit();
    });
  });
};

window.addEventListener("load", pay);

/* v1からv2へ変更となった為、部分修正20230106
const pay = () => {
  //Payjp.setPublicKeyというオブジェクトとメソッドは、導入したpayjp.jsの中で定義されているもの
  // Payjp.setPublicKey("pk_test_261d031e025e6da409352989"); // PAY.JPテスト公開鍵
  Payjp.setPublicKey(process.env.PAYJP_PUBLIC_KEY);//環境変数を呼び出すため

  // 鍵情報は公開厳禁で、公開状態でGitHubにPushするなどしてしまうと、コードに含まれる鍵情報が公開され、不正請求などの被害にあうリスクがある。
  // この鍵の情報は環境変数にて設定する。



  // クレジットカード情報のトークン化を、フォーム送信時に実行されるようにするため.
  const submit = document.getElementById("button");
  // ”button”というidを指定して、送信ボタンの要素を取得
  submit.addEventListener("click", (e) => {
    // その送信ボタンがclickされたときにイベントが発火
    e.preventDefault();
    // e.preventDefault();で通常のRuby on Railsにおけるフォーム送信処理はキャンセルされ、現状では「購入」ボタンをクリックしても、
    // サーバーサイドへリクエストは送られない。
    // console.log("フォーム送信時にイベント発火") //うまく実装できたら、送信ボタンがclickされたときにイベントが発火する



    // ブラウザ上に表示されているフォームの情報を取得するための記述
    const formResult = document.getElementById("charge-form");
    const formData = new FormData(formResult);

    // 生成したFormDataオブジェクトから、クレジットカードに関する情報を取得し、変数cardに代入するオブジェクトとして定義。
    // "order[number]"などは、各フォームのname属性の値のこと。
    const card = {
      number: formData.get("order[number]"),
      cvc: formData.get("order[cvc]"),
      exp_month: formData.get("order[exp_month]"),
      exp_year: `20${formData.get("order[exp_year]")}`,
    };
   //// ブラウザ上に表示されているフォームの情報を取得するための記述

  //// クレジットカード情報のトークン化を、フォーム送信時に実行されるようにするため.


  // カード情報をPAY.JP側に送りトークン化するためには、pay.jsが提供するPayjp.createToken(card, callback)というオブジェクトとメソッドを使用
  // 第一引数のcardは、PAY.JP側に送るカードの情報で、直前のステップで定義したカード情報のオブジェクトが入る。
  // 第二引数のcallbackには、PAY.JP側からトークンが送付された後に実行する処理を記述

  Payjp.createToken(card, (status, response) => {
    // createTokenメソッドの第一引数には、上でで定義したクレジットカード情報が入る。第二引数にはアロー関数を用いて、
    // レスポンスを受け取ったあとの処理を記述。アロー関数の引数に指定した変数には、PAY.JP側からのレスポンスとステータスコードが含まれる。
    // statusはトークンの作成がうまくなされたかどうかを確認できる、HTTPステータスコードが入る。
    // responseはそのレスポンスの内容が含まれ、response.idとすることでトークンの値を取得することができる。
      if (status == 200) {
        const token = response.id;
        // console.log(token)// HTTPステータスコードが200のとき、すなわちうまく処理が完了したときだけ、トークンの値を取得するように実装

        // JavaScriptでinput要素を生成しフォームに加え、その値としてトークンをセット,トークンの値をフォームに含める。
        const renderDom = document.getElementById("charge-form");

        // const tokenObj = `<input value=${token} name='token'>`;
        const tokenObj = `<input value=${token} name='token' type="hidden"> `; //トークンの値はユーザーに見せる必要のない情報だからで、type属性の値にhiddenを指定

        // HTMLのinput要素にトークンの値を埋め込み、フォームに追加。valueは実際に送られる値、nameはその値を示すプロパティ名（params[:name]のように取得できるようになる）を示す
        renderDom.insertAdjacentHTML("beforeend", tokenObj);
        // フォームの中に作成したinput要素を追加
        // debugger; binding.pryのように、一時停止
        //// JavaScriptでinput要素を生成しフォームに加え、その値としてトークンをセット,トークンの値をフォームに含める。
      }
      // フォームに存在するクレジットカードの各情報を削除
      document.getElementById("order_number").removeAttribute("name");
      document.getElementById("order_cvc").removeAttribute("name");
      document.getElementById("order_exp_month").removeAttribute("name");
      document.getElementById("order_exp_year").removeAttribute("name");
      //// フォームに存在するクレジットカードの各情報を削除

      // フォームの情報をサーバーサイドに送信、上段部e.preventDefault();で通常のRuby on Railsにおけるフォーム送信処理はキャンセルされており、JavaScript側からフォームの送信処理を行う必要がある。
      document.getElementById("charge-form").submit();
      //// フォームの情報をサーバーサイドに送信

    });
  //// カード情報をPAY.JP側に送りトークン化するためには、pay.jsが提供するPayjp.createToken(card, callback)というオブジェクトとメソッドを使用    
  });
};

window.addEventListener("load", pay);

*/