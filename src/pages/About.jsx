const team = [
  { name: 'Hamzah Alyamani', id: '222110595' },
  { name: 'Abdulrahman AlKhattaf', id: '222110131' },
]

export default function About() {
  return (
    <section>
      <div className="page-head"><h1>About</h1></div>
      <div className="panel">
        <h2>Team</h2>
        <ul className="team">
          {team.map(m => (
            <li key={m.id}>
              <span className="avatar" aria-hidden>{m.name.split(' ').map(w => w[0]).join('')}</span>
              <span><b>{m.name}</b><span className="mono muted">{m.id}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
