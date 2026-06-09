// Curated collection of high-quality quotes categorized by tags
const LOCAL_QUOTES = [
    // Inspirational
    {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt",
        tag: "Inspirational"
    },
    {
        text: "Do not wait to strike till the iron is hot; but make it hot by striking.",
        author: "William Butler Yeats",
        tag: "Inspirational"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        tag: "Inspirational"
    },
    {
        text: "Act as if what you do makes a difference. It does.",
        author: "William James",
        tag: "Inspirational"
    },
    {
        text: "Limit your 'always' and your 'nevers'.",
        author: "Amy Colette",
        tag: "Inspirational"
    },
    {
        text: "Keep your face always toward the sunshine - and shadows will fall behind you.",
        author: "Walt Whitman",
        tag: "Inspirational"
    },
    {
        text: "Out of clutter, find simplicity. From discord, find harmony. In the middle of difficulty lies opportunity.",
        author: "Albert Einstein",
        tag: "Inspirational"
    },
    {
        text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
        author: "Zig Ziglar",
        tag: "Inspirational"
    },
    {
        text: "You do not find the happy life. You make it.",
        author: "Camilla Eyring Kimball",
        tag: "Inspirational"
    },
    {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle",
        tag: "Inspirational"
    },

    // Wisdom
    {
        text: "The only true wisdom is in knowing you know nothing.",
        author: "Socrates",
        tag: "Wisdom"
    },
    {
        text: "The journey of a thousand miles begins with a single step.",
        author: "Lao Tzu",
        tag: "Wisdom"
    },
    {
        text: "In the end, it's not the years in your life that count. It's the life in your years.",
        author: "Abraham Lincoln",
        tag: "Wisdom"
    },
    {
        text: "Better to remain silent and be thought a fool than to speak out and remove all doubt.",
        author: "Abraham Lincoln",
        tag: "Wisdom"
    },
    {
        text: "Knowing yourself is the beginning of all wisdom.",
        author: "Aristotle",
        tag: "Wisdom"
    },
    {
        text: "The simple things are also the most extraordinary things, and only the wise can see them.",
        author: "Paulo Coelho",
        tag: "Wisdom"
    },
    {
        text: "Time is a created thing. To say 'I don't have time,' is like saying, 'I don't want to.'",
        author: "Lao Tzu",
        tag: "Wisdom"
    },
    {
        text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
        author: "Ralph Waldo Emerson",
        tag: "Wisdom"
    },
    {
        text: "We don't see things as they are, we see them as we are.",
        author: "Anaïs Nin",
        tag: "Wisdom"
    },
    {
        text: "He who has a why to live can bear almost any how.",
        author: "Friedrich Nietzsche",
        tag: "Wisdom"
    },

    // Life
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon",
        tag: "Life"
    },
    {
        text: "Get busy living or get busy dying.",
        author: "Stephen King",
        tag: "Life"
    },
    {
        text: "You only live once, but if you do it right, once is enough.",
        author: "Mae West",
        tag: "Life"
    },
    {
        text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
        author: "Thomas A. Edison",
        tag: "Life"
    },
    {
        text: "If you want to live a happy life, tie it to a goal, not to people or things.",
        author: "Albert Einstein",
        tag: "Life"
    },
    {
        text: "Never let the fear of striking out keep you from playing the game.",
        author: "Babe Ruth",
        tag: "Life"
    },
    {
        text: "Money and success don't change people; they merely amplify what is already there.",
        author: "Will Smith",
        tag: "Life"
    },
    {
        text: "Your time is limited, so don't waste it living someone else's life.",
        author: "Steve Jobs",
        tag: "Life"
    },
    {
        text: "Not how long, but how well you have lived is the main thing.",
        author: "Seneca",
        tag: "Life"
    },
    {
        text: "Life is a succession of lessons which must be lived to be understood.",
        author: "Helen Keller",
        tag: "Life"
    },

    // Success
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston S. Churchill",
        tag: "Success"
    },
    {
        text: "The secret of success is to do the common thing uncommonly well.",
        author: "John D. Rockefeller Jr.",
        tag: "Success"
    },
    {
        text: "I fail-safe my life by trying. Success is a natural consequence.",
        author: "Unknown",
        tag: "Success"
    },
    {
        text: "I find that the harder I work, the more luck I seem to have.",
        author: "Thomas Jefferson",
        tag: "Success"
    },
    {
        text: "Success usually comes to those who are too busy to be looking for it.",
        author: "Henry David Thoreau",
        tag: "Success"
    },
    {
        text: "Don't be distracted by criticism. Remember—the only taste of success some people get is to take a bite out of you.",
        author: "Zig Ziglar",
        tag: "Success"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
        tag: "Success"
    },
    {
        text: "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.",
        author: "Colin Powell",
        tag: "Success"
    },
    {
        text: "Success is walking from failure to failure with no loss of enthusiasm.",
        author: "Winston S. Churchill",
        tag: "Success"
    },
    {
        text: "If you really look closely, most overnight successes took a long time.",
        author: "Steve Jobs",
        tag: "Success"
    },

    // Technology
    {
        text: "The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.",
        author: "Tim Berners-Lee",
        tag: "Technology"
    },
    {
        text: "Computers are useless. They can only give you answers.",
        author: "Pablo Picasso",
        tag: "Technology"
    },
    {
        text: "The human spirit must prevail over technology.",
        author: "Albert Einstein",
        tag: "Technology"
    },
    {
        text: "One machine can do the work of fifty ordinary men. No machine can do the work of one extraordinary man.",
        author: "Elbert Hubbard",
        tag: "Technology"
    },
    {
        text: "Technology is a useful servant but a dangerous master.",
        author: "Christian Lous Lange",
        tag: "Technology"
    },
    {
        text: "It has become appallingly obvious that our technology has exceeded our humanity.",
        author: "Albert Einstein",
        tag: "Technology"
    },
    {
        text: "The science of today is the technology of tomorrow.",
        author: "Edward Teller",
        tag: "Technology"
    },
    {
        text: "Any sufficiently advanced technology is indistinguishable from magic.",
        author: "Arthur C. Clarke",
        tag: "Technology"
    },
    {
        text: "Technology is best when it brings people together.",
        author: "Matt Mullenweg",
        tag: "Technology"
    },
    {
        text: "The real danger is not that computers will begin to think like men, but that men will begin to think like computers.",
        author: "Sydney J. Harris",
        tag: "Technology"
    },

    // Humor
    {
        text: "I am so clever that sometimes I don't understand a single word of what I am saying.",
        author: "Oscar Wilde",
        tag: "Humor"
    },
    {
        text: "People say nothing is impossible, but I do nothing every day.",
        author: "A. A. Milne",
        tag: "Humor"
    },
    {
        text: "If you think you are too small to make a difference, try sleeping with a mosquito.",
        author: "Dalai Lama",
        tag: "Humor"
    },
    {
        text: "I always arrive late at the office, but I make up for it by leaving early.",
        author: "Charles Lamb",
        tag: "Humor"
    },
    {
        text: "My doctor told me that running could add years to my life. I think he was right. I feel ten years older already.",
        author: "Milton Berle",
        tag: "Humor"
    },
    {
        text: "I'm not superstitious, but I am a little stitious.",
        author: "Michael Scott",
        tag: "Humor"
    },
    {
        text: "A day without sunshine is like, you know, night.",
        author: "Steve Martin",
        tag: "Humor"
    },
    {
        text: "Behind every great man is a woman rolling her eyes.",
        author: "Jim Carrey",
        tag: "Humor"
    },
    {
        text: "I find television very educating. Every time somebody turns on the set, I go into the other room and read a book.",
        author: "Groucho Marx",
        tag: "Humor"
    },
    {
        text: "All you need in this life is ignorance and confidence, and then success is sure.",
        author: "Mark Twain",
        tag: "Humor"
    }
];
