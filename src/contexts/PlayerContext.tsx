import { createContext } from 'react';
import { useState, ReactNode } from 'react'

type Episode = {

  title: string;
  members: string;
  thumbnail: string;
  duration: string;
  url: string;
};

type PlayerContextData = {

  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  playNext: () => void;
  playPrevious: () => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isLooping: boolean;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  isShuffling: boolean;
  clearPlayerState: () => void;

}

type PlayerContextProviderProps = {
  children: ReactNode;
}


export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {


  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsplaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {

    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsplaying(true);

  }

  function playList(list: Episode[], index: number) {

    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsplaying(true);
  }

  function togglePlay() {
    setIsplaying(!isPlaying);
  }


  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {

    setIsplaying(state);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = (currentEpisodeIndex + 1) < episodeList.length;

  function playNext() {

    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {

      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {

    if (hasPrevious) {

      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (

    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      playNext,
      playPrevious,
      isPlaying,
      togglePlay,
      setPlayingState,
      playList,
      hasNext,
      hasPrevious,
      toggleLoop,
      isLooping,
      isShuffling,
      toggleShuffle,
      clearPlayerState
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

