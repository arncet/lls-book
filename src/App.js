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

const stopAnimation = keyframes`
  0% {
    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1);
  }

  100% {
    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1);
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
  animation: ${({ flipped }) => flipped ? css`${stopAnimation} 1.5s ease forwards` : css`${bounceAnimation} 1.5s cubic-bezier(0, 1.04, 0.51, 1.23) 2s infinite`};
`

const StyledBookWrapper = styled.div`
  transform-style: preserve-3d;
  transition: all 0.5s ease ${({ flipped }) => flipped ? '0' : '0.75'}s;
  transform: rotate3d(0, 1, 0, ${({ flipped }) => flipped ? '0' : '20'}deg) translate3d(0px, 0px, ${({ flipped }) => flipped ? '250' : '-100'}px);
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
  border: 1px solid #929292d9;
`

class App extends Component{
  state = { flipped: false }

  flip = () => this.setState(state => ({ flipped: !state.flipped }))

  render() {
    const { flipped } = this.state

    return (
      <StyledWrapper>
        <StyledBookWrapper flipped={flipped}>
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
        </StyledBookWrapper>
      </StyledWrapper>
    )
  }
}

export default App
