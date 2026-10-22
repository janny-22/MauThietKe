import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
/*Điểm khởi động (Entry Point) của React, gắn component App 
vào thẻ <div id="root"></div> trong file HTML. */