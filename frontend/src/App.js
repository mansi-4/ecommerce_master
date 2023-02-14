import { Container } from 'react-bootstrap'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import OrderListScreen from './screens/OrderListScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ColorListScreen from './screens/ColorListScreen'
import ColorEditScreen from './screens/ColorEditScreen'
import SizeListScreen from './screens/SizeListScreen'
import SizeEditScreen from './screens/SizeEditScreen'
import CategoryListScreen from './screens/CategoryListScreen'
import CategoryEditScreen from './screens/CategoryEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'

function App() {
  return (
    <BrowserRouter>
      <Header/>
       <main className='py-3'>
        <Container>
          <Routes>
            <Route exact path="/" element={<HomeScreen/>} />
            <Route path="/login" element={<LoginScreen/>} />
            <Route path="/register" element={<RegisterScreen/>} />
            <Route path="/profile" element={<ProfileScreen/>} />
            <Route path="/shipping" element={<ShippingScreen/>} />
            <Route path="/payment" element={<PaymentScreen/>} />
            <Route path="/placeorder" element={<PlaceOrderScreen/>} />
            <Route path="/order/:id" element={<OrderScreen/>} />
            <Route path="/product/:id" element={<ProductScreen/>}/>
            {/* /cart/:id this shows that after selecting qty cart page */}
            <Route path="/cart/:id" element={<CartScreen/>}/>
            {/* /cart this shows that directly going to cart page */}
            <Route path="/cart" element={<CartScreen/>}/>
            <Route path="/admin/userlist" element={<UserListScreen/>}/>
            <Route path="/admin/user/:id/edit" element={<UserEditScreen/>}/>
            <Route path="/admin/colorlist" element={<ColorListScreen/>}/>
            <Route path="/admin/color/:id/edit" element={<ColorEditScreen/>}/>
            <Route path="/admin/sizelist" element={<SizeListScreen/>}/>
            <Route path="/admin/size/:id/edit" element={<SizeEditScreen/>}/>
            <Route path="/admin/categorylist" element={<CategoryListScreen/>}/>
            <Route path="/admin/category/:id/edit" element={<CategoryEditScreen/>}/>

            <Route path="/admin/productlist" element={<ProductListScreen/>}/>
            <Route path="/admin/product/:id/edit" element={<ProductEditScreen/>}/>
            <Route path="/admin/orderlist" element={<OrderListScreen/>}/>


            </Routes>
        </Container>
       </main>
       <Footer/>
    </BrowserRouter>
  );
}

export default App;
