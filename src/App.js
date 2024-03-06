import React from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import Drawer from "./components/Drawer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";


function App() {

  const [items, setItems] = React.useState([]);

  const [cartItems, setCartItems] = React.useState([]);

  const [favorites, setFavorites] = React.useState([]);

  const [cartOpened, setCartOpened] = React.useState(false);

  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    axios.get('https://65e1fecda8583365b317c42e.mockapi.io/items').then(res => {
      setItems(res.data);
    });
    axios.get('https://65e1fecda8583365b317c42e.mockapi.io/cart').then(res => {
      setCartItems(res.data);
    });
    // favorites нет в MockAPI
    // axios.get('https://65e1fecda8583365b317c42e.mockapi.io/favorites').then(res => {
    //   setFavorites(res.data);
    // })
  }, []);

  const onAddToCart = (obj) => {
    axios.post('https://65e1fecda8583365b317c42e.mockapi.io/cart', obj);
    setCartItems(prev => [...prev, obj]);
  }

  const onRemoveItem = (id) => {
    axios.delete(`https://65e1fecda8583365b317c42e.mockapi.io/cart/${id}`);
    setCartItems(prev => prev.filter(item => item.id !== id));
  }

  const onAddToFavorite = /*async*/ (obj) => {
    // favorites нет в MockAPI
    try {
      if (favorites.find(favObj => favObj.imageUrl === obj.imageUrl)) {
        // axios.delete(`https://65e1fecda8583365b317c42e.mockapi.io/favorites/${id}`);
        setFavorites(prev => prev.filter(item => item.imageUrl !== obj.imageUrl));
      }
      else{
      //const {data} = await axios.post('https://65e1fecda8583365b317c42e.mockapi.io/favorites', obj);
      // setFavorites(prev => [...prev, data]);
      setFavorites(prev => [...prev, obj]);
      }
    } catch (error) {
      alert("Не удалось добавить в фавориты");
    }

    
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  }

  return (
    <div className="wrapper clear">

      {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} />}


      <Header
        onClickCart={() => setCartOpened(true)}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              items={items}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavorite={onAddToFavorite}
              onAddToCart={onAddToCart}
            />
          }
          exact
        />
        <Route
          path="/favorites"
          element={
            <Favorites
              items={favorites}
              onAddToFavorite={onAddToFavorite}
            />
          }
          exact
        />
      </Routes>



    </div>
  );
}

export default App;
