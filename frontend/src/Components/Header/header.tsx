import logo from '../../assets/img/logo-branco.svg'
import imgPerfil from '../../assets/img/usuario-demo.jpg'
import Search from '../Search/search'
import Avatar from '../Avatar/avatar'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { OptionsHeader as Options } from '../../types/types'
import { useAuth } from '../../hooks/useAuth'
import { StyledHeader, LogoLink, NavLinks, SearchWrapper, DesktopAvatar, MobileMenuButton, MobileMenuOverlay, MobileMenuContent, CloseButton, MobileMenuLogo } from '.'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [options, setOptions] = useState<Options>({
    label: user?.apelido || "",
    item: [
      { id: 1, texto: "Configurações" },
      { id: 2, texto: "Favoritos" },
      { id: 3, texto: "Sair", onClick: () => logout() }
    ]
  })

  useEffect(() => {
    if (user) {
      setOptions(prev => ({
        ...prev,
        label: user.apelido || ""
      }))
    }
  }, [user])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <StyledHeader>
        <LogoLink to="/">
          <img src={logo} alt="imagem logo svg" />
        </LogoLink>

        <NavLinks>
          <Link to="/">Início</Link>
          <Link to="/chat">Chatbot</Link>
          <Link to="/favorites">Favoritas</Link>
        </NavLinks>

        <SearchWrapper>
          <Search texto="Pesquisar post..." />
        </SearchWrapper>

        <DesktopAvatar>
          <Avatar img={user?.avatar ?? imgPerfil} options={options} />
        </DesktopAvatar>

        <MobileMenuButton onClick={() => setIsMenuOpen(true)}>
          <Menu size={28} />
        </MobileMenuButton>
      </StyledHeader>

      <MobileMenuOverlay $isOpen={isMenuOpen} onClick={closeMenu}>
        <MobileMenuContent $isOpen={isMenuOpen} onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={closeMenu}>
            <X size={28} />
          </CloseButton>

          <MobileMenuLogo>
            <img src={logo} alt="imagem logo svg" />
          </MobileMenuLogo>

          <nav>
            <Link to="/" onClick={closeMenu}>Início</Link>
            <Link to="/chat" onClick={closeMenu}>Chatbot</Link>
            <Link to="/favorites" onClick={closeMenu}>Favoritas</Link>
          </nav>

          <div className="mobile-avatar">
            <Avatar img={imgPerfil} options={options} />
          </div>
        </MobileMenuContent>
      </MobileMenuOverlay>
    </>
  )
}

export default Header