
import styles from './styles.module.scss';
import Image from 'next/image';
import { useContext, useRef, useEffect, useState } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgres] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        toggleLoop,
        toggleShuffle,
        isShuffling,
        clearPlayerState,
    } = useContext(PlayerContext);

    const episode = episodeList[currentEpisodeIndex];

    useEffect(() => {

        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause();
        }

    }, [isPlaying]);

    function setupProgressListener() {

        audioRef.current.currentTime = 0; // always when you change the song will go back to zero.

        audioRef.current.addEventListener('timeupdate', event => {

            setProgres(Math.floor(audioRef.current.currentTime));
        })

    }

    function handleSeek(amount: number) {

        console.log(amount);

        audioRef.current.currentTime = amount;
        setProgres(amount);

    }

    function handleEpisodeEnded(){

        if(hasNext){
            playNext();
        }else{
            clearPlayerState(); 
        }
    }

    return (
        <div className={styles.playerContainer}>
            <header>
                <Image src="/playing.svg" alt="Tocando agora" width={100} height={100} />
                <strong>Tocando agora {episode?.title}</strong>
            </header>

            {episode ? (

                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) :

                (

                    <div className={styles.emptyPlayer} >
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                )
            }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {
                            episode ?
                                (
                                    <Slider
                                        max={Number(episode.duration)}
                                        value={progress}
                                        onChange={handleSeek} //propertie used when changing the pin location
                                        trackStyle={{ backgroundColor: '#04D361' }}
                                        railStyle={{ backgroundColor: '#9F75FF' }}
                                        handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
                                    />
                                ) :
                                (
                                    <div className={styles.emptySlider} />
                                )
                        }
                    </div>
                    <span>{convertDurationToTimeString(Number(episode?.duration) ?? 0)}</span>
                </div>

                {episode && (

                    <div>
                        <audio
                            src={episode.url}
                            ref={audioRef}
                            autoPlay
                            loop={isLooping}
                            onPlay={() => setPlayingState(true)}
                            onPause={() => setPlayingState(false)}
                            onEnded={handleEpisodeEnded}
                            onLoadedMetadata={setupProgressListener}
                        />
                    </div>
                )}

                <div className={styles.buttons}>
                    <button type="button"
                        disabled={!episode || episodeList.length === 1}
                        onClick={() => { toggleShuffle(); }}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <Image src="/shuffle.svg" alt="Embaralhar" width={25} height={25} />
                    </button>
                    <button
                        type="button"
                        disabled={!episode || !hasPrevious}
                        onClick={playPrevious}

                    >
                        <Image src="/play-previous.svg" alt="Tocar anterior" width={25} height={25} />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}

                    >
                        {
                            isPlaying ?
                                <Image src="/pause.svg" alt="Tocar" width={25} height={25} />
                                :
                                <Image src="/play.svg" alt="Tocar" width={25} height={25} />
                        }
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <Image src="/play-next.svg" alt="Tocar próxima" width={25} height={25} />
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={() => { toggleLoop(); }}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <Image src="/repeat.svg" alt="Repetir" width={25} height={25} />
                    </button>
                </div>
            </footer>
        </div >
    )
}