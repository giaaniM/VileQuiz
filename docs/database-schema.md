# Database e Persistenza

## 📊 Schema MongoDB

### Collection: categories

```javascript
{
  _id: ObjectId,
  name: "Geografia",
  description: "Esplora il mondo con quiz su capitali, monumenti e curiosità",
  icon_url: "https://images.unsplash.com/...",
  difficulty_range: ["easy", "medium"],
  total_questions_generated: 1247,
  avg_rating: 4.5,
  created_at: ISODate,
  updated_at: ISODate
}
```

### Collection: games

```javascript
{
  _id: ObjectId,
  game_pin: "123456",
  category: "Geografia",
  host_socket_id: "abc123",
  status: "active", // lobby, active, finished
  players: [
    {
      socket_id: "xyz789",
      nickname: "Player1",
      avatar: "viking",
      score: 0,
      answers: []
    }
  ],
  questions: [...],
  current_question_index: 0,
  created_at: ISODate,
  finished_at: ISODate
}
```

### Collection: statistics

```javascript
{
  _id: ObjectId,
  game_id: ObjectId,
  total_players: 12,
  total_questions: 10,
  avg_correct_percentage: 67.5,
  avg_response_time: 8.3,
  winner: "Player1",
  winner_score: 9,
  leaderboard: [...],
  created_at: ISODate
}
```

## 🔴 Redis Cache Structure

- **Key pattern**: `game:{pin}` → Game state completo
- **Key pattern**: `session:{socket_id}` → Player session
- **TTL**: 2 ore (auto-cleanup giochi inattivi)
- **Pub/Sub channels** per real-time events

## 🗄️ Hosting Database

### MongoDB Atlas (FREE)
- **Free tier**: 512MB storage
- **Setup**: mongodb.com/atlas
- **Connection**: Connection string in .env

### Redis - Upstash (FREE)
- **Free tier**: 10k commands/day
- **Setup**: upstash.com
- **Alternative**: Render Redis (25MB free)
