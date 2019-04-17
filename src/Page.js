import React from 'react'
import styled from 'styled-components'

const StyledPage = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  transform-style: preserve-3d;
  width: 250px;
  height: 100%;
  z-index: ${({ zIndex }) => zIndex};
  box-shadow: 0px 0px 1px 0px #00000033;
  border-top-left-radius: ${({ isCover }) => isCover ? '0' : '3'}px;
  border-bottom-left-radius: ${({ isCover }) => isCover ? '0' : '3'}px;
  transform: rotate3d(0, 1, 0, ${({ flipped, rotateY }) => flipped ? `${rotateY}deg` : '-0deg'});
  transition: all 1s ease ${({ delay }) => delay}s;
  transform-origin: left center;
`

const StyledSide = styled.div`
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  position: absolute;
  top: 0;
  left: 0;
  background-size: ${({ isCover }) => isCover ? 'contain' : 'cover'};
  backface-visibility: hidden;
  background-image: url("${({ page }) => page}");
`

const StyledPageFront = styled(StyledSide)`
  box-shadow: ${({ isCover }) => !isCover ? 'inset 15px 0px 12px -10px #0000002e' : '' };
  border-top-right-radius: ${({ isCover }) => isCover ? '3px' : '0px'};
  border-bottom-right-radius: ${({ isCover }) => isCover ? '3px' : '0px'};
  border-top-left-radius: ${({ isCover, flipped }) => !isCover && flipped ? '3px' : '0px'};
  border-bottom-left-radius: ${({ isCover, flipped }) => !isCover && flipped ? '3px' : '0px'};
`

const StyledPageBack = styled(StyledSide)`
  transform: rotate3d(0, 1, 0, -180deg);
  box-shadow: inset -15px -1px 16px -5px #00000036;
  border-top-right-radius: ${({ isCover }) => isCover ? '0px' : '3px'};
  border-bottom-right-radius: ${({ isCover }) => isCover ? '0px' : '3px'};
`

const Page = ({ flipped, delay = 0, isCover, zIndex, rotateY, page }) =>
  <StyledPage zIndex={zIndex} isCover={isCover} flipped={flipped} rotateY={rotateY} delay={delay}>
    <StyledPageFront isCover={isCover} page={page} flipped={flipped} />
    <StyledPageBack isCover={isCover} page={page} />
  </StyledPage>

export default Page
