# nautilus_front

node v16.15.0
npm v8.5.5
## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## Nautilusとは？
#### 様々な情報レイヤーを一枚の地図に重ねて、その場所や地域の価値を知るためのアプリです。

<img width="1019" alt="スクリーンショット 2022-11-30 19 39 02" src="https://user-images.githubusercontent.com/76609328/204778425-f696bdb1-42fe-48da-b1cb-f8552d2dca67.png">


#### 主な機能は以下の３つ
<img width="1044" alt="スクリーンショット 2022-11-30 19 44 09" src="https://user-images.githubusercontent.com/76609328/204778510-4d0cf3ed-f03b-468e-8da9-8ae4d4668f9d.png">


### 今回は機能①に注目しつつ、*日本の都道府県ごとの地域性*を知ることができるアプリを開発しました。
<hr>

## 実際のアプリ画面

![動画１](https://user-images.githubusercontent.com/76609328/204788982-9c899e9d-5bcb-4ecf-aa9f-2a2fc44f890d.gif)
#### 1. 画面左サイドバーからレイヤーを選択するとレイヤー情報に応じて地図が塗り分けられます。
#### 2. レイヤーは複数選択することができレイヤーの重ね合わせによる複合的な情報を可視化することができます。
#### 3. 任意の地点をクリックするとその地点のレイヤー情報をまとめて取得することができます。
#### この例では人口密度と県民所得のレイヤーを選択しており、色の濃さおよびクリックによって東京都が両者とも高い数値であることがわかります。

## その他の機能

### 1. ランキング機能
![動画２](https://user-images.githubusercontent.com/76609328/204791251-3fdef490-5d5a-4999-bb45-5a8154a124f1.gif)

#### ランキング表示によって色情報ではなく表形式でデータを見ることができます。
<hr>

### 2. 相関係数計算機能
![動画３](https://user-images.githubusercontent.com/76609328/204791824-3bf439fd-a4b7-416c-b53d-99437c437f19.gif)

#### レイヤー同士の関係性を相関係数を計算することで目安的に知ることができます。
#### 人口密度と県民所得の例ではやや正の相関が見られる。
#### →このことから人口密度の高い地域ほど都市部が多く、都市部では所得が平均的に高いことというような考察することができます。

<hr>

## 活用例

### 全国のがん罹患率の分布を科学的根拠に基づいたがん予防に関連したレイヤーを用いて考察する
> 出典：国立がん研究センターがん情報サービス「がん統計」（全国がん登録）

### 全国で最もがんの罹患率の高い地域をご存知でしょうか？以下を御覧ください。
<img width="1438" alt="スクリーンショット 2022-11-30 23 32 47" src="https://user-images.githubusercontent.com/76609328/204823395-47bb8596-a44d-4931-bb86-50f178b74273.png">

#### 全国的に分布していますが罹患率上位の３県は北の地域に固まっていることがわかります。これには何か地域性があるのでしょうか？
#### この疑問に答えるべく科学的根拠に基づいたがんの要因とされている飲酒・喫煙・運動に関するデータを用意しました。

<img width="1424" alt="スクリーンショット 2022-11-30 23 37 02" src="https://user-images.githubusercontent.com/76609328/204824220-214f5ab4-97bb-476c-b88c-4af4cb54e1e9.png">


#### 結果は確かに北の地域が最も濃い色を示していることがわかります。
#### しかしながら相関係数を計算してみるとどれも数値上では相関はありませんでした。
#### 例えばかなり赤く表示されている宮崎県に注目してみましょう。


<img width="1425" alt="スクリーンショット 2022-11-30 23 39 20" src="https://user-images.githubusercontent.com/76609328/204824918-38622cba-2c4e-4b88-bfc8-a1bfff2d45ed.png">

#### なんとがんの罹患率は最低の４７位です。科学的根拠に基づけばがんになるリスクが高いはずなのに一体なぜでしょうか？
#### 私は宮崎県には何かがんの予防にプラスに働く県民性のようなものが隠れているのではないかと考えます。
#### 以上の例のようにこのアプリで複合的に情報を可視化することで新たな仮説やひらめきのようなものが生まれるかもしれません！
#### 使い方は無限大です！！！！

<hr>

## 今後の展開
#### 今回は日本の都道府県に限定してレイヤーを扱ったが技術的には世界規模や逆に局地的な情報を扱うことも可能です。


### 世界
<img width="1425" alt="スクリーンショット 2022-11-30 19 23 32" src="https://user-images.githubusercontent.com/76609328/204793989-0e5a5fdf-d8c4-460a-aca9-c578e8141b70.png">

#### 世界の貧困に関連するレイヤー。多くのアフリカ地域が貧困に苦しんでいて、アジアや南米も一部が該当しているとひと目でわかります。

<hr>

### 局地
<img width="1427" alt="スクリーンショット 2022-11-30 19 24 40" src="https://user-images.githubusercontent.com/76609328/204795087-092418ed-24ef-4bac-bac6-8c3b115e2a92.png">

#### 例として愛知県の行政地域ごとの人口マップを表示しました。かなり細かいレベルで描画することが可能です。
#### なおこちらのデータは国土交通省の[国土数値情報ダウンロードサービス](https://nlftp.mlit.go.jp/ksj/index.html)がオープンデータとして公開しているデータを利用しており、国や自治体も近年GISデータの活用に力を入れています。

### GISデータを活用していきましょう！
