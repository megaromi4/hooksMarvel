import { Component } from "react";

import Spinner from "../spinner/spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";

import "./charList.scss";

class CharList extends Component {
  marvelService = new MarvelService();

  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    const { charList, loading, error, offset, newItemLoading, charEnded } =
      this.state;

    const items = charList.map((char) => {
      return (
        <Char
          id={char.id}
          key={char.id}
          name={char.name}
          thumbnail={char.thumbnail}
          onSelectedChar={this.props.onSelectedChar}
          onClick={() => {
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
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{ display: charEnded ? "none" : "block" }}
          onClick={() => {
            this.onRequest(offset);
          }}
        >
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
