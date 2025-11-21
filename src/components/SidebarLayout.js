import React from 'react';

const SidebarLayout = ({ children }) => {
    return (
        <div className="row">
            <aside className="theme-doc-sidebar-container col col--3">
                <div className="sidebar">
                    <nav>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#installation">Installation</a></li>
                            <li><a href="#usage-guide">Usage Guide</a></li>
                            <li><a href="#troubleshooting">Troubleshooting</a></li>
                            <li><a href="#technical-details">Technical Details</a></li>
                        </ul>
                    </nav>
                </div>
            </aside>
            <main className="col col--9">
                {children}
            </main>
        </div>
    );
};

export default SidebarLayout;
