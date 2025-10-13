import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ crumbs }) => {
    return (
        <nav aria-label="breadcrumb" className="container mx-auto my-4 px-4">
            <ol className="flex items-center text-white space-x-2">
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <li key={index} className="flex items-center">
                            {isLast ? (
                                <span className="text-neutral-400 font-semibold">{crumb.label}</span>
                            ) : (
                                <Link to={crumb.path} className="text-primary hover:underline">
                                    {crumb.label}
                                </Link>
                            )}
                            {!isLast && <span className="mx-2 text-neutral-500">/</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
