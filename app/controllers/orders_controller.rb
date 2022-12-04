class OrdersController < ApplicationController
  def index
    @order = Order.new
  end

  def create
    # binding.pry
    @order = Order.new(order_params)
    # binding.pry
    if @order.valid?
      pay_item #コントローラーの記述がやや複雑で読みにくく、新たにメソッドを定義し、決済処理を移動。
      @order.save
      return redirect_to root_path
    else
      render 'index'
    end
  end

  private

  def order_params
    # params.require(:order).permit(:price)
    # binding.pryでcreateアクションを確認すると、priceの情報はorderというキーのバリューに、ハッシュ形式で含まれているが、token情報はorderというキーのバリューとしては含まれてないため、mergeメソッドを用いてこのtokenの値を結合
    params.require(:order).permit(:price).merge(token: params[:token])
    # 上の記述で、order_params[:price]としてpriceの情報が、order_params[:token]としてtokenの情報が取得できるようになる。
  end

  def pay_item #「リファクタリング」
        # 決済処理を行うには、秘密鍵をPAY.JP側へ送付する必要があり、PAY.JPのAPIのGem「payjp」が提供する、Payjpクラスのapi_keyというインスタンスに秘密鍵を代入。
      # また、決済に必要な情報は同様にGemが提供する、Payjp::Charge.createというクラスおよびクラスメソッドを使用し定義。
      # バリデーションを正常に通過した時のみに、決済処理が行われるように設定
      # Payjp.api_key = "sk_test_XXXXXXXXXX"  # 自身のPAY.JPテスト秘密鍵で秘密鍵は公開してはいけない。公開のままGitHubにpushしない。
      Payjp.api_key = ENV["PAYJP_SECRET_KEY"]
      Payjp::Charge.create(
        amount: order_params[:price],  # 商品の値段(実際に決済する金額)
        card: order_params[:token],    # カードトークン
        currency: 'jpy'                 # 取引に使用する通貨の種類（日本円）
      )
      #/// バリデーションを正常に通過した時のみに、決済処理が行われるように設定
  end
end
