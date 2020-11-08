# addEventListenerのリスナ関数に引数を渡す&解除可能にする
※使用ファイル: qiita_addEventListener.html

### 解決したい問題

- addEventListenerのコールバック関数に引数を渡したい  
- リスナは1回だけ使用してすぐにイベントリスナをremoveしたい  



### その１: コールバック関数に引数を渡す方法  


1.   Function.prototype.bindを使う  

```
var message = 'Hola!';

var greeting = function(message, event) {
    console.log(message);
    console.log(event);
    };

element.addEventListener('click', greeting.bind(null, message), false);
```
出力結果  
```  
Hola!
MouseEvent {}
```
`.bind`は第一引数に、ターゲットである`greeting`関数のthisの値を指定する  
`null`で`this`は`Window`になる  



Eventオブジェクトは、通常必ず引数としてコールバック関数へ渡される
なので呼び出す際はEventオブジェクトを明示しなくてもいい



この場合、Eventオブジェクトは必ず引数群の「一番最後」に追加されている  



2. handleEvent()を含むオブジェクトを渡す  

```
var message = 'Hola!';

var greeting = function(event) {
    console.log(this);
    console.log(this.msg);
    console.log(event);
    };

element.addEventListener('click', {handleEvent: greeting, msg: message}, false);
```  
出力結果  
```
{msg: message, handleEvent: f}
Hola!
MouseEvent {}
```  

つまりコールバック関数の引数ではなく、代わりにプロパティとして渡す方法です  
これが実現できる理由は2つあって  

- `handleEvent`が含まれていること  
    これが含まれていることによって、`addEventListener`に渡したオブジェクトが  
    `EventListener`インターフェースとして認識されてhandleEevntメソッドをコールバック関数として実行してくれる  

- コールバック関数のthis値が、`addEventListener`に渡したオブジェクトを指すから  

`this`がオブジェクトを指すので、オブジェクトのプロパティにコールバック関数がアクセスすることができるようになるというわけ  

こいつを使う際の問題は、  
`this`がオブジェクトに固定されてしまうことであり、
たとえばクラスのメソッドにアクセスできない。  

もしも`click`した要素にアクセスしたい場合、  
コールバック関数内で`event.currentTarget`でアクセスすればよい
```
// handleEventとして渡すコールバック関数
var greeting = function(event) {
    console.log(event.currentTarget);
}
```
出力結果  
```
<button class="btn"></button>
```  



3.  IIFE
```
var message = 'Hola!';
var greeting = function(message, event) {
    console.log(message);
    console.log(event);
}

element.addEventListener('click', (function(){
    return function(e) {
        greeting(message, e);
    }
})());
```  
出力結果  
```
Hola!
MouseEvent
```

即時関数とクロージャを使う方法  
引数は渡せるし、`event`オブジェクトも取得できる  

  


ざっと調べてみたところ以上の3点が確認可能な方法だった  



### 各方法でイベントリスナをremoveしてみる



removeするための条件は、


- コールバック関数が無名関数ではないこと
- 同じ要素・同じ関数名を指定すること



基本の確認:  

`button.set`をクリックすると、`div.box`にイベントリスナがセットされて  
引数をコンソール表示するのと、イベントリスナを除去するようにします  


HTML  
```
<body>
    <button class="set">set event listener</button>
    <div class="box">click me</div>
</body>
```  
script  
```
    var set = document.querySelector('.set');
    var box = document.querySelector('.box');

    // callback function
    var handler = function (event) {
        console.log('box has clicked');
        box.removeEventListener('click', handler, false);
    }

    
    set.addEventListener('click', function (event) {
        console.log('set event listener');

        box.addEventListener('click', handler, false);
    });
```  
引数を渡さない場合、正常に`handler`を`box`からremove出来たことが確認できました  
では引数をコールバック関数に渡しつつ、一度だけ発火するイベントリスナをremoveできるか確認します  



1. callback.bindの場合  

```
    var handler = function (message, event) {
        console.log(message);
        console.log(event);
        box.removeEventListener('click', handler, false);
    }

    set.addEventListener('click', function (event) {
        console.log('set event listener');
        var message = 'HOLA!';

        box.addEventListener('click', handler.bind(null, message), false);
    });

```

結果、`message`は表示されたので、引数を渡せていますが  
removeは出来ていないようです。  
また、何度も`set`ボタンをクリックすると`box`へイベントリスナが重複して登録されているのが確認できました。  


2. IIFEの場合  

```
    // callback 
    var handler = function (message, event) {
        console.log('box has clicked');
        console.log(message);
        console.log(event);
        box.removeEventListener('click', handler, false);
    }

    set.addEventListener('click', function () {
        var message = 'HOLA!';
        box.addEventListener('click', (function () {

             // `event` should be passed here.
            return function callback(event) {
                handler(message, event);
                box.removeEventListener('click', callback, false);
            }
        })(), false);
    });
```  

今回は引数`message`を`handler`へ渡し、  
なおかつ`callback`をremoveできたことが確認できました  



3. handlerEvent()含むオブジェクトを渡す場合  

```
    // callback
    var handlerIncaseHandleEvent = function (event) {
        console.log('box has clicked');
        console.log(this.msg);
        console.log(event);

        // thisを指定すること
        box.removeEventListener('click', this, false);
    }


    // Object case
    set.addEventListener('click', function () {
        var message = "HOLA!";
        box.addEventListener('click', {
            handleEvent: handlerIncaseHandleEvent,
            msg: message,
        }, false);
    });

```

結果、引数を渡すことは成功しており、removeの成功も確認できました。  



### 各方法の一長一短  


callback.bind, IIFE, Objectの3通りの方法について、
引数を渡す方法、引数を渡して自らremoveする方法の結果を見てきました。  


それぞれの方法について長所・短所を独断と偏見でまとめてみます  

- .bind  

    スコープをコントロールしやすく、OOP開発のような他のクラスのメソッドを縦断して利用するような開発において、  
    this値を明示的に指定できるので利用しやすそうと思いましたが  　
    よく考えたら、callback.bind()が`removeEventListener`では除去できないのは致命的であるように思えます




- IIFE

    結果からみると一番制約がなく使い勝手がよさそうに見えます。  
    しいて言えば、クロージャのcallbackの中身が冗長になりがちというくらいでしょうか  



- `handleEvent`を含む`Object`を渡す場合

    最もわかりやすいので使いやすいですが、  
    `this`が固定されてしまうので、呼出したcallback関数は自身のクラスのメソッドを使うことができない  





### 最後に


今回の難敵`addEventListener`を手玉に取るために、  
~~「要素の内側と外側を判別するプログラム」を作ってみました~~  
数日中にその記事をあげるかもです。


当記事はVanillaJS習作を制作中の初心者開発者による現状の学習経過のアウトプットの一つです。  
先人の皆様からの間違いのご指摘や、  
よりよい方法を教えてくださるとこれ幸いです。  
(OOP開発においてスコープと引数と解除可能をどうやって成立させているのやら)  

ご覧いただきありがとうございました。

