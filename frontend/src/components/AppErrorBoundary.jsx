import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-screen">
          <section className="error-panel">
            <h1>SwiftRide could not load</h1>
            <p>{this.state.error.message}</p>
            <button
              className="primary-button"
              onClick={() => {
                localStorage.removeItem('swiftride_user');
                window.location.href = '/';
              }}
            >
              Reset and reload
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
