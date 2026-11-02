import "./Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__name">Irene Alcaíne</p>
      <ul className="footer__links">
        <li>
          <a href="mailto:irenealcainealvarez@gmail.com">
            irenealcainealvarez@gmail.com
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/irenealcaine/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href="https://github.com/irenealcaine"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </li>
      </ul>
    </footer>
  )
}
