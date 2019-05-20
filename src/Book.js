import React, { Component, createRef } from 'react'
import styled, { css, keyframes } from 'styled-components'
import map from 'lodash/map'
import size from 'lodash/size'
import isEqual from 'lodash/isEqual'

import Page from './Page'

const MOVE_TO_CENTER_DURATION = 1
const ROTATE_BOOK_DELAY = 0.75
const ROTATE_PAGE_DELAY_STEP = 0.1

const bounceAnimation = keyframes`
  0% {
    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1);
  }

  20% {
    transform: translate3d(0px, -100px, 0px) scale3d(0.95, 1.02, 1);
  }

  40% {
    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1);
  }

  100% {
    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1);
  }
`

const StyledWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  pointer-events: none; // Fix firefox
  transform-origin: center;
  transition: transform ${MOVE_TO_CENTER_DURATION}s ease ${({ isCentered }) => isCentered ? '0' : MOVE_TO_CENTER_DURATION}s, z-index ${MOVE_TO_CENTER_DURATION}s ease;
  transform: ${({ center, isCentered }) => isCentered ? `translate3d(${center.x}px, ${center.y}px, 0px)` : 'none'};
  z-index: ${({ isCentered, wasCentered }) => isCentered ? 2 : wasCentered ? 1 : 0};

  & > * {
    pointer-events: auto; // Fix firefox
  }
`

const StyledBook = styled.div`
  position: relative;
  transform-style: preserve-3d;
  height: 365px;
  width: 250px;
  animation: ${({ isOpened }) => isOpened ? 'none' : css`${bounceAnimation} 1.5s cubic-bezier(0, 1.04, 0.51, 1.23) 2s infinite`};
`

const StyledBookWrapper = styled.div`
  display: inline-block;
  transform-style: preserve-3d;
  transition: all 0.5s ease ${({ isOpened }) => isOpened ? '0' : ROTATE_BOOK_DELAY }s;
  transform: rotate3d(0, 1, 0, ${({ isOpened }) => isOpened ? '0' : '20'}deg) translate3d(${({ isOpened }) => isOpened ? '50' : '0'}%, 0px, ${({ isOpened }) => isOpened ? '250' : '0'}px);
`

const StyledSpin = styled.div`
  position: absolute;
  left: -37px;
  height: 100%;
  width: 35px;
  transform: rotate3d(0, 1, 0, -90deg) translate3d(${({ isOpened }) => isOpened ? '-30' : '0'}px,0px,0px);
  transition: transform 0.5s ease ${({ isOpened }) => isOpened ? '0' : ROTATE_BOOK_DELAY}s;
  transform-origin: right;
  background: #eaeaea;
  border: 1px solid #929292d9;
`

class Book extends Component{
  constructor(props) {
    super(props)
    this.state = { center: { x: 0, y: 0 } }
  }

  ref = createRef()

  componentDidMount = () => {
    this.setCenter()
  }

  componentWillUnmount = () => {
    this.timeout && clearTimeout(this.timeout)
  }

  componentDidUpdate = prevProps => {
    if (!isEqual(prevProps.parentCenter, this.props.parentCenter)) this.setCenter()
  }

  setCenter = () => {
    const { top, left, width, height } = this.ref.current.getBoundingClientRect()
    const { parentCenter } = this.props
    const x = parentCenter.x - left - (width / 2)
    const y = parentCenter.y - top - (height / 2)
    this.setState({ center: { x, y } })
  }

  render() {
    const { isOpened, wasOpened, open, book: { otherPages, cover, page1, page2 }, rerolling } = this.props
    const { center } = this.state
    const pages = [...otherPages, page1, page2]
    const pageIsOpened = isOpened && !rerolling

    return (
      <StyledWrapper ref={this.ref} center={center} isCentered={isOpened} wasCentered={wasOpened}>
        <StyledBookWrapper isOpened={isOpened}>
          <StyledBook onClick={!rerolling ? open : undefined} isOpened={isOpened}>
            <Page
              isOpen={pageIsOpened}
              delay={pageIsOpened ? 0 : ROTATE_PAGE_DELAY_STEP * size(pages)}
              isCover={true}
              zIndex={size(pages) + 1}
              rotateY={-180}
              front={cover.front}
              back={cover.back}
            />
            {map(pages, (page, index) =>
              <Page
                isOpen={size(pages) -1 === index ? false : pageIsOpened}
                delay={pageIsOpened ? ROTATE_PAGE_DELAY_STEP * index : ROTATE_PAGE_DELAY_STEP * (size(pages) - index)}
                zIndex={size(pages) - index}
                rotateY={-180 + 10 * index}
                front={page.front}
                back={page.back}
                key={index}
              />
            )}
            <StyledSpin isOpened={isOpened} />
          </StyledBook>
        </StyledBookWrapper>
      </StyledWrapper>
    )
  }
}

export default Book
