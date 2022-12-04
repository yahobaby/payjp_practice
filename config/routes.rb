Rails.application.routes.draw do
  # フォームがあるページを表示するためのindexアクション設定
  root to: 'orders#index'
  # 購入金額を記録するためのcreateアクションに対応するルーティングを設定
  resources :orders, only:[:create]
end
