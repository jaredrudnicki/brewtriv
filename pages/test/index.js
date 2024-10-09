import fetchQuiz from '@/fetchers/fetchQuiz';

export default function Page() {

    return (
        <button
            onClick={async() => await fetchQuiz('don quixote quiz', 'don quixote, his life, and his story')}
        >
            click me - create quiz
        </button>
    );
}
