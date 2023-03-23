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
      return (
        <Char
          id={char.id}
          key={char.id}
          name={char.name}
          thumbnail={char.thumbnail}
          onSelectedChar={this.props.onSelectedChar}
          onClick={() => {
            console.log(char.id);
            this.props.onSelectedChar(char.id);
          }}
        />
      );
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

const Char = ({ name, thumbnail, id, onSelectedChar }) => {
  let imgStyle = { objectFit: "cover" };
  if (
    thumbnail ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    imgStyle = { objectFit: "fill" };
  }

  return (
    <li
      className="char__item"
      onClick={() => {
        onSelectedChar(id);
      }}
    >
      <img
        src={thumbnail}
        style={imgStyle}
        alt="Random character"
        className="randomchar__img"
      />
      <div className="char__name">{name}</div>
    </li>
  );
};

export default CharList;
