import React, { PureComponent, createRef } from 'react'
import styled from 'styled-components'
import { BOOKS } from './fixtures'
import get from 'lodash/get'
import random from 'lodash/random'
import size from 'lodash/size'
import isNil from 'lodash/isNil'

import Book from './Book'
import { Replay, Eye, Close } from './Icons'

const REROLLING_DELAY = 2

const StyledApp = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 50px;
  height: 100vh;
  box-sizing: border-box;
  background: radial-gradient(circle at center,#94eaff 0,#00b3df 60%)
`

const StyledTopbar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: #005469;
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
  z-index: 2;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.15);
  transition: all 0.5s ease;

  transform: ${({ isOpened }) => `translate3d(${isOpened ? '0' : '-100'}%, 0px, 0px)`};
`

const StyledIconText = styled.div`
  transition: all 0.1s ease;
`

const StyledIconWrapper = styled.div`
  color: ${({ isDisabled }) => isDisabled ? 'grey' : '#FFF'};
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
  pointer-events: ${({ isDisabled }) => isDisabled ? 'none' : 'auto'};

  svg{
    border: 1px solid;
    padding: 10px;
    border-radius: 50%;
    transition: all 0.1s ease;
  }

  &:hover{
    ${StyledIconText} {
      text-decoration: underline;
    }

    svg {
      background-color: #FFF;
      color: #005469;
    }
  }

`

const getRandomBookPages = ({ firstPage, otherPages }) => {
  const randomIndex = random(0, size(otherPages) - 1)
  return {
    page1: get(otherPages, randomIndex - 1, firstPage),
    page2: get(otherPages, randomIndex)
  }
}

const generateBooks = () => BOOKS.map(book => ({
  ...book,
  ...getRandomBookPages(book)
}))

class App extends PureComponent{
  constructor(props) {
    super(props)
    this.state = {
      x: 0,
      y: 0,
      openedBookIndex: null,
      lastOpenedBookIndex: null,
      rerollBookIndex: null,
      books: generateBooks()
    }
  }

  ref = createRef()

  componentDidMount = () => {
    this.setCenter()
    window.addEventListener('resize', this.setCenter)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.setCenter)
  }

  setCenter = () => {
    const { width, height } = this.ref.current.getBoundingClientRect()
    this.setState({ x: width / 2, y: height / 2 })
  }

  open = index => {
    const { openedBookIndex } = this.state
    const isSame = openedBookIndex === index
    const newOpenedBookIndex = isSame ? null : index
    this.setState({ openedBookIndex: newOpenedBookIndex, lastOpenedBookIndex: openedBookIndex })
  }

  reroll = () => {
    const { books, openedBookIndex } = this.state
    const book = get(books, openedBookIndex)
    const { page1, page2 } = getRandomBookPages(book)
    const newBook = { ...book, page1, page2 }
    const newBooks = Object.assign([], books, { [openedBookIndex]: newBook })
    this.setState({ rerollBookIndex: openedBookIndex })
    this.timeout = setTimeout(() => this.setState({ rerollBookIndex: null, books: newBooks}), REROLLING_DELAY * 1000)
  }

  render() {
    const { x, y, openedBookIndex, rerollBookIndex, lastOpenedBookIndex, books } = this.state

    console.log(lastOpenedBookIndex)

    return (
      <StyledApp ref={this.ref}>
        {books.map((book, i) =>
          <Book
            book={book}
            key={i}
            parentCenter={{ x, y }}
            isOpened={openedBookIndex === i}
            wasOpened={lastOpenedBookIndex === i}
            rerolling={rerollBookIndex === i}
            open={() => this.open(i)}
          />
        )}
        <StyledTopbar isOpened={!isNil(openedBookIndex)}>
          <div>
            <StyledIconWrapper onClick={this.reroll} isDisabled={isNil(openedBookIndex)}>
              <Replay />
              <StyledIconText>Relancer</StyledIconText>
            </StyledIconWrapper>
            <StyledIconWrapper>
              <Eye />
              <StyledIconText>Voir plus</StyledIconText>
            </StyledIconWrapper>
          </div>
          <StyledIconWrapper onClick={() => this.open(null)}>
            <Close />
            <StyledIconText>Fermer</StyledIconText>
          </StyledIconWrapper>
        </StyledTopbar>
      </StyledApp>
    )
  }
}

export default App
