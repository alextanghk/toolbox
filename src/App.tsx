import React from 'react';
import './index.css';
import './App.css';
import PDFEditor from './pages/PDFEditor';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/pdf-editor" component={PDFEditor} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
