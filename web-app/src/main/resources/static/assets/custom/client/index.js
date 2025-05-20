const TOKEN_LOCAL = localStorage.getItem("TOKEN");
const CONFIG_LOCAL = {
    headers: {
        'Authorization': `Bearer ${TOKEN_LOCAL}`
    }
};

const ID_LOCAL = localStorage.getItem("ID");

var CART_ID = null;

async function getCountCart(){
    const GET_CART_BY_USER_ID = `http://45.63.79.165:8080/api/carts/customer/${ID_LOCAL}`;
    const CREATE_CART_BY_CUSTOMER_ID = `http://45.63.79.165:8080/api/carts`;
    // const COUNT_CART = `http://45.63.79.165:8080/api/carts/count/{ID_LOCAL}`

    //----tạo giỏ hàng
    // await axios.post(CREATE_CART_BY_CUSTOMER_ID, {customer_id: ID_LOCAL}, CONFIG_LOCAL)
    //     .then(response => {
    //         console.log(response.data.data);
    //         console.log("Tạo giỏ hàng thành công");
    //     })
    //     .catch(error => {
    //         console.error('Lỗi khi gọi tạo giỏ hàng:', error);
    //     });

    //---lấy ra giỏ hàng hiện tại 
    // await axios.get(GET_CART_BY_USER_ID)
    //     .then(response => {
    //         console.log("data giỏ hàng ==== ", response.data);
    //         // console.log("giỏ hàng ==== ", response.data.cartItems.length);
    //         var countCart = response.data.count;
    //         CART_ID = response.data.id;
    //         console.log("CART_ID === ", CART_ID);
    //         document.getElementById('cart-count').innerText = countCart;
    //     })
    //     .catch(error => {
    //         console.error('Lỗi khi lấy giỏ hàng:', error);
    //     });

    try {
        // Đầu tiên, thử lấy giỏ hàng hiện có
        console.log("lay giỏ hàng hiện có...");
        const cartResponse = await axios.get(GET_CART_BY_USER_ID, CONFIG_LOCAL);

        // Nếu thành công, lấy thông tin giỏ hàng
        console.log("data giỏ hàng ==== ", cartResponse.data);
        var countCart = cartResponse.data.cartItems.count;
        CART_ID = cartResponse.data.id;
        console.log("CART_ID === ", CART_ID);
        document.getElementById('cart-count').innerText = countCart;
    } catch (error) {
        // Nếu không tìm thấy giỏ hàng, tạo mới
        console.log('Không tìm thấy giỏ hàng, đang tạo mới...');

        try {
            const createResponse = await axios.post(
                CREATE_CART_BY_CUSTOMER_ID,
                {customer_id: ID_LOCAL},
                CONFIG_LOCAL
            );
            console.log(createResponse.data.data);
            console.log("Tạo giỏ hàng thành công");

            // Sau khi tạo, lấy lại thông tin giỏ hàng mới
            const newCartResponse = await axios.get(GET_CART_BY_USER_ID);
            console.log("data giỏ hàng mới ==== ", newCartResponse.data);
            CART_ID = newCartResponse.data.id;
            document.getElementById('cart-count').innerText = newCartResponse.data.count || 0;
        } catch (createError) {
            console.error('Lỗi khi tạo giỏ hàng:', createError);
        }
    }
    
}

async function addToCartDB(idSP, tensp, giaBan, imageUrl, moTa){
    if(localStorage.getItem("TOKEN") == null){
        window.location.href = "/account/login";
        return;
    }
    
    var URL_ADD_CART_ITEM = `http://45.63.79.165:8080/api/cart-items/add`;

    var data = {
        "product_id": idSP,
        "price": giaBan, 
        "quantity" : 1,
        "cart_id": CART_ID
    }
    
    await axios.post(URL_ADD_CART_ITEM, data, CONFIG_LOCAL)
        .then(response => {
            console.log(response.data.data);
            console.log("Thêm sản phẩm vào giỏ hàng thành công");

            // Cập nhật số lượng giỏ hàng
            var currentCount = parseInt(document.getElementById('cart-count').innerText);
            document.getElementById('cart-count').innerText = currentCount + 1;
        })
        .catch(error => {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        });

    getCountCart();
}
//------init
getCountCart();