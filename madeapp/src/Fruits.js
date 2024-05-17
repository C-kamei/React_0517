import React, { useState, useEffect } from 'react';
import './Fruits.css';

function Fruits() {
  // dataには何が入る？
  // setDataの呼び出し箇所に注目（※１）
  const [data, setData] = useState([]);
                                  /*↑ ここに初期値。無しだとundefinedになる */

  useEffect(() => {
    fetchFruitData();
  }, []);

  const fetchFruitData = () => {
    fetch('http://localhost:8080/fruits')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => {
         // catchを入れることで、サーバに接続できなくなったときに
         //画面にエラーを出す代わりにコンソールに出す
        console.error('Error fetching fruit data:', error);
        setData([]);
      });
  };

  //在庫情報を追加する関数
  const addStock = (formData) => {
    fetch('http://localhost:8080/fruits/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
      // 在庫情報が正常に追加された場合、フルーツデータを再取得して更新する
        fetchFruitData();
      } else {
       // エラーメッセージを表示するなどの処理を行う
        console.error('Failed to add stock');
      }
    })
    .catch(error => {
      console.error('Error adding stock:', error);
    });
  };

  //在庫情報を削除する関数
  const deleteStock = (id) => {
    fetch('http://localhost:8080/fruits/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    .then(response => {
      if (response.ok) {
        fetchFruitData();
      } else {
        console.error('Failed to delete stock');
      }
    })
    .catch(error => {
      console.error('Error deleting stock:', error);
    });
  };


   // フォームから送信された際の処理
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newStock = {
      name: formData.get('name'),
      price: parseInt(formData.get('price')),
      stock: parseInt(formData.get('stock'))
    };
    addStock(newStock);
  };

  return (
    <div>
      <h3>フルーツ在庫情報</h3>
      <table border="1">
        <thead>
          <tr>
            <th>商品コード</th>
            <th>商品名</th>
            <th>単価</th>
            <th>在庫数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.stock}</td>
              <td><button onClick={() => deleteStock(item.id)}>削除</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>在庫情報追加</h3>
      <form onSubmit={handleSubmit}>
        <label>
          商品名:
          <input type="text" name="name" required />
        </label>
        <label>
          単価:
          <input type="number" name="price" required />
        </label>
        <label>
          在庫数:
          <input type="number" name="stock" required />
        </label>
        <button type="submit">追加</button>
      </form>
    </div>
  );
}

export default Fruits;
