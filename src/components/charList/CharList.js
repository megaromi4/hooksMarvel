import { Component } from "react";

import Spinner from "../spinner/spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";

import "./charList.scss";

class CharList extends Component {
  marvelService = new MarvelService();

  state = { allChar: [], loading: true, error: false };

  onCharLoaded = (allChar) => {
    this.setState({ allChar, loading: false });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  updateChar = () => {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  componentDidMount() {
    this.updateChar();
  }

  render() {
    const { allChar, loading, error } = this.state;

    const items = allChar.map((char) => {
      return <Char key={char.id} name={char.name} thumbnail={char.thumbnail} />;
    });

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        <ul className="char__grid">
          {errorMessage}
          {spinner}
          {content}
        </ul>
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

const Char = ({ name, thumbnail }) => {
  return (
    <li className="char__item">
      {thumbnail ==
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ? (
        <img
          src={thumbnail}
          style={{
            objectFit: "contain",
          }}
          alt="Random character"
          className="randomchar__img"
        />
      ) : (
        <img
          src={thumbnail}
          alt="Random character"
          className="randomchar__img"
        />
      )}
      <div className="char__name">{name}</div>
    </li>
  );
};

export default CharList;
