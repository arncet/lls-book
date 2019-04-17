import React, { Component } from 'react'
import styled, { css, keyframes } from 'styled-components'
import map from 'lodash/map'

import Page from './Page'

const PAGES = [
  'https://assets.lls.fr/books/978-2-37760-153-0-GEO2_P_2019.png',
  'https://assets.lls.fr/marketing/geographie/GEO_DP_argu_edito_1.png',
  'https://assets.lls.fr/marketing/geographie/GEO_DP_argu_edito_2.png',
  'https://assets.lls.fr/marketing/geographie/GEO_DP_argu_edito_3.png',
  'https://assets.lls.fr/marketing/geographie/GEO_DP_argu_edito_4.png',
  'https://assets.lls.fr/marketing/geographie/GEO_DP_argu_edito_5.png',
  'https://assets.lls.fr/marketing/geographie/GEO_DP_argu_edito_9.png',
]

const bounceAnimation = keyframes`
  0% {
    transform: translate3d(0px, 0px, 0px);
  }

  50% {
    transform: translate3d(0px, -100px, 0px);
  }

  100% {
    transform: translate3d(0px, 0px, 0px);
  }
`


const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  height: 100vh;
`

const StyledBook = styled.div`
  position: relative;
  transform-style: preserve-3d;
  height: 365px;
  transform: rotate3d(0, 1, 0, ${({ flipped }) => flipped ? '0' : '20'}deg) translate3d(0px, 0px, ${({ flipped }) => flipped ? '250' : '-100'}px);
  transition: transform 0.5s ease ${({ flipped }) => flipped ? '0' : '0.75'}s;
  //animation: ${({ flipped }) => flipped ? 'none' : css`${bounceAnimation} 3s linear infinite`};
`

const StyledSpin = styled.div`
  position: absolute;
  left: -37px;
  height: 100%;
  width: 35px;
  transform: rotate3d(0, 1, 0, -90deg) translate3d(${({ flipped }) => flipped ? '-30' : '0'}px,0px,0px);
  transition: transform 0.5s ease ${({ flipped }) => flipped ? '0' : '0.75'}s;
  transform-origin: right;
  background: #eaeaea;
  //box-shadow: inset -2px 1px 11px 0px #71717159;
  border: 1px solid #929292d9;
`

class App extends Component{
  state = { flipped: false }

  flip = () => this.setState(state => ({ flipped: !state.flipped }))

  render() {
    const { flipped } = this.state

    return (
      <StyledWrapper>
        <StyledBook onClick={this.flip} flipped={flipped}>
          {map(PAGES, (page, index) =>
            <Page
              flipped={[5, 6].includes(index) ? false : flipped}
              delay={flipped ? 0.1 * index : 0.1 * (6 - index)}
              isCover={[0, 6].includes(index)}
              zIndex={6 - index}
              rotateY={-180 + 10 * index}
              page={page}
              key={index}
            >
              {index}
            </Page>
          )}
          <StyledSpin flipped={flipped} />
        </StyledBook>
      </StyledWrapper>
    )
  }
}

export default App
