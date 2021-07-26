
import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from './episode.module.scss';

import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { useContext } from 'react';
import { PlayerContext, PlayerContextProvider } from '../../contexts/PlayerContext';

type Episode = {

    id: string;
    title: string;
    members: string;
    thumbnail: string;
    description: string;
    duration: string;
    durationAsString: string;
    url: string;
    publishedAt: string;
};

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {

    const { play } = useContext(PlayerContext);

    const router = useRouter();

    console.log()

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title}</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button" >
                        <Image src="/arrow-left.svg" alt="Voltar" width={20} height={20} />
                    </button>
                </Link>
                <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
                <button onClick={() => { play(episode); }}>
                    <Image src="/play.svg" alt="Tocar episódio" width={30} height={30} />
                </button>
            </div>
            <header>
                <h1>
                    {episode.title}
                </h1>
                <span>
                    {episode.members}
                    {episode.publishedAt}
                    {episode.durationAsString}
                </span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    const { data } = await api.get('episodes', {

        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {
        paths: paths, // also it could be just an empty array like path: []
        fallback: 'blocking'
    }

}

export const getStaticProps: GetStaticProps = async (context) => {

    const { slug } = context.params;

    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        pubilshedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24 //24 hours
    }
}