### MVC もでるとは？

- Model : システムの中でロジックを担当 データの変更をviewへ通知するのもModelの役割
- View : UIへの表示、入出力
- Controller : ユーザーの入力に基づいて、modelとviewを制御する　Controllerが直接描画、データ変更をしない

#### シナリオ

1. コントローラが入力を監視する
2. ユーザが入力する
3. コントローラがユーザの入力に反応してモデルのメソッドを呼び出す
    結果モデルのデータが更新されうる
4. モデルが変更された場合に、viewへ通知する
5. ビューはモデルから関連するデータを取得して、出力を更新する



#### todo-app

Controller:

    入力を検知して、ModelとViewへすべき処理を通知する

      - ModelとViewのインスタンスを持つ
      - "viewインスタンスを介して"入力に関わる要素を取得して、必要なイベントリスナを付ける
        (つまりcontrollerはあくまでhtmlの要素を扱わない。それはviewの管轄である)


Model:

    主データの処理というか変更を施す

      - Storeインスタンスを持つ
      - 主データとそれにかかわる要素を取得している
      - 主データを更新する
      - 更新内容をstoreへ通知する
      - Storeインスタンスを介してstoreとやり取りする

View:

    クライアント表示を担う

      - html要素を取得する
      - controllerの通知に従いhtmlを変更する




#### 開発上身に着けた小手先テクニック


- 他のインスタンスのメソッドを呼び出すときにそのメソッドのthisがメソッドのインスタンスをささない場合の対処法
- addEventListenerのコールバックに引数を渡してなおかつ後でremoveEventListenerできるようにする方法
- コールバック関数に引数を渡してスコープをコールバック関数の属するインスタンスにする方法









#### toggle-allはいつもチェックする必要がある

- addNewTodo:
  必ずcompleted: fasleのtodoが追加されるので、それ以前まですべてのtodoがtrueだった場合、
  input.toggle-allはuncheckしないといけない

同様に、toggle, toggleAll, delete, clearCompletedの時はtoggle-allのチェック是非を検査しなくてはいけない
どこでチェックすべきか


何をチェックしなくっちゃあいけないのか？
ul.todo-list[] のtodo[].completedのbool値




### dblclickでフォームを開く

ul.todo-list li dblclick:
  - `dblclick`された要素から`dblclick`イベントリスナを除去する
  - document.addEventListener('click', handler)
  - `dblclick`された要素のviewを変更する
    (formにする、div.viewをdisplay: noneにする, input.inputに`keypress`イベントリスナを付ける)


document click:
  - event.pathで内外を判断するよ
  - inside で return
  - outside で
    - document.removeEventListener('click', handler)
    - フォーム要素を元の要素に戻す
    - フォーム要素で入力された新たなタイトルをmodelへ
    - 再度、div.viewに`dblclick`イベントリスナをセットする




### CSS 知見メモ

#### 要素を重ねる

checkboxを装飾したいけどinput[type="checkbox"]の装飾は大変
`input[type="checkbox"]`の上に`label`を重ねて`label`をcheckboxの代わりにするテクニック

例)
```html
<div class="block">
  <input id="toggle-all" class="toggle-all" type="checkbox">
  <label for="toggle-all">Mark all as complete</label>
<div>
```
```css
.block {
  position: relative;
}

.toggle-all {
  display: none;
  position: absolute;
} 




```
前提：
input[type="checkbox"]の子要素labelの属性にforをつけて、inputのクラス名をつける
--> labelがinput[type="checkbox"]と同じ振る舞いをする
--> つまりlabelがinput[type="chekcbox"]の代わりになれる
--> チェックボックスに装飾ができる!


1.  親要素div.blockをposition: relative;にすることでdiv.blockが通常のレイアウトフローから外れる
--> div.blockのposition: absolute設定の子要素の包含ブロックがdiv.blockになる
--> div.blockを基準にしてどこでも要素を配置できるようになった

2. input.toglle-allを「見えなくする」
方法はいくつかある
    - display: none;にする
    - width: 1px; height: 1px; opacity: 0;にする

3. .toggle-all + label {}でcontent: ""を定義する
content属性はlabelの中身を書き換えるっぽい


4. labelの位置をinput.toggle-allに重ねる

