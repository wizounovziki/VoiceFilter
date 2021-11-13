import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import MarkNav from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';
import '../css/app.css';

const Markdown = () => {
  const [md, handleMD] = useState('loading... ...');

  useEffect(() => {
    fetch('/README.md')
      .then((resp) => resp.text())
      .then((txt) => handleMD(txt));
  }, [md]);

  return (
    <div>
      <div className="nav-container">
        <MarkNav className="article-menu" source={md} headingTopOffset={80} ordered={false} />
      </div>
      <div className="article-container">
        <ReactMarkdown plugins={[[gfm, { singleTilde: false }]]} allowDangerousHtml>
          {md}
        </ReactMarkdown>
      </div>
    </div>
  );
};
export default Markdown;