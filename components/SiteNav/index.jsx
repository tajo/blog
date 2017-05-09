import React from 'react';
import './style.css';

class SiteNav extends React.Component {
  render() {
    return (
      <nav className="blog-nav">
        <ul>
          <li>
            <a href="https://miksu.cz" activeClassName="current"> Kontakt
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default SiteNav;
