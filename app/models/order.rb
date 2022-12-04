class Order < ApplicationRecord
  # tokenについてもOrderモデルで使用できるようにするため
  attr_accessor :token
  # この記述がないと、ordersビューにおいてunknown attribute 'token' for Order.のエラーが出る
  # //tokenについてもOrderモデルで使用できるようにするため
  validates :price, presence: true

  validates :token, presence: true #こちらのバリデーションがないと、orderビューにおいて、金額のみ入力、クレジットは空にした際、「Payjp::InvalidRequestError in OrdersController#create」エラーが出てしまう。
  # こちらのバリデーションにより、tokenが空の場合、orderコントローラーのif @order.valid?でfalseとなり、エラーメッセージがブラウザ上に表示される。
  # tokenはordersテーブルに存在しないため、本来Orderモデルのバリデーションとしては記載できまないが、attr_accessor :tokenと記載したことにより、tokenについてのバリデーションも記述できるようになる。

end
