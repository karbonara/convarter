import { useState, useEffect } from 'react';
import { Block } from './Block';

const CACHE_KEY = 'btc_rate_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут в миллисекундах

const Converter = () => {
  const [value, setValue] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [rate, setRate] = useState(0);

  // Получение текущего курса BTC из API CoinDesk
  useEffect(() => {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY));
    const currentTime = new Date().getTime();

    if (cache && cache.currency === currency && currentTime - cache.timestamp < CACHE_DURATION) {
      // Если данные в кеше не устарели, то используем их
      setRate(cache.rate);
    } else {
      // Если данные в кеше устарели, то обновляем их, получив новые из API
      const fetchRate = async () => {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
        const data = await response.json();
        const newRate = data.bpi[currency].rate_float;
        setRate(newRate);

        // Сохраняем данные в локальном хранилище с текущим временем
        localStorage.setItem(CACHE_KEY, JSON.stringify({ currency, rate: newRate, timestamp: currentTime }));
      };
      fetchRate();
    }
  }, [currency]);

  // Обработчики изменения значения и выбранной валюты
  const handleChangeValue = (newValue) => {
    setValue(newValue);
  };
  const handleChangeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  // Функция для перевода введенного значения в BTC
  const btcValue = value / rate;

  return (
    <div>
      <Block value={value} currency={currency} onChangeValue={handleChangeValue} onChangeCurrency={handleChangeCurrency} />
      <p>Курс BTC к {currency}: {rate.toFixed(2)}</p>
      <p>{value} {currency} = {btcValue.toFixed(8)} BTC</p>
    </div>
  );
};


export default Converter;
