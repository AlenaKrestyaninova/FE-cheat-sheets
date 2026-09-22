# Code splitting - React.lazy и Suspense

— это техника оптимизации, которая разбивает бандл приложения на меньшие части, загружаемые по необходимости. Это ускоряет загрузку приложения и снижает потребление ресурсов.

#### **По роутам**:

Динамическая загрузка компонентов для каждого маршрута. Используется с библиотекой react-router и React.lazy с Suspense. Например, компонент страницы загружается только при переходе на соответствующий маршрут.

\- Suspense - обертка для возможности динамической загрузки
\- fallback - пропс с запасным UI для отображения загрузки
\- React.lazy - функция для ленивой загрузки компонента
\- динамический импорт

```javascript
const LazyComponent = React.lazy(() => import('./Component'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Загрузка...</div>}> // Обертка с отображением загрузки 
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/lazy-route" component={LazyComponent} />
        </Switch>
      </Suspense>
    </Router>
  );
}
```

#### **По компонентам**:

Разделение крупных или редко используемых компонентов на отдельные чанки. Например, модальное окно или сложный виджет загружается только при необходимости.

`const LazyModal = React.lazy(() => import('./Modal'));`

#### **По состоянию - условная загрузка**:

Загрузка кода в зависимости от состояния приложения (например, авторизация или определённые действия пользователя). Используется с динамическим импортом и условиями.

```javascript
if (user.isAuthenticated) {
	import('./PremiumFeature').then(module => setComponent(module.default));
}
```

## Error Boundary {#introducing-error-boundaries}

— это компоненты React, которые отлавливают ошибки JavaScript в любом месте деревьев их дочерних компонентов, сохраняют их в журнале ошибок и выводят запасной UI вместо рухнувшего дерева компонентов

Предохранители работают как JavaScript-блоки `catch {}`, но только для компонентов. **Только классовые компоненты** могут выступать в роли предохранителей.

! **предохранители отлавливают ошибки исключительно в своих дочерних компонентах**

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Можно отрендерить запасной UI произвольного вида
      return <h1>Что-то пошло не так.</h1>;
    }

    return this.props.children; 
  }
}
```

И дальше использовать его как обычный компонент

```javascript
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```