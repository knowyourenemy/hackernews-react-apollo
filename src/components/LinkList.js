import React, { useState } from 'react';
import Link from './Link';
import { useQuery, gql } from '@apollo/client';
import { useHistory } from 'react-router';
import { AUTH_TOKEN, LINKS_PER_PAGE } from '../constants';

export const FEED_QUERY = gql`
  query FeedQuery(
    $filter: String
    
  ) {
    feed (filter: $filter){
      links {
        id
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
      }
    }
  }
}
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;



const LinkList = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const getQueryVariables = (isNewPage, page) => {
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const take = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = { createdAt: 'desc' };
    const filter = searchFilter;
    return { take, skip, orderBy, filter };
  };
  const history = useHistory();
  const isNewPage = history.location.pathname.includes(
    'new'
  );
  const pageIndexParams = history.location.pathname.split(
    '/'
  );
  const page = parseInt(
    pageIndexParams[pageIndexParams.length - 1]
  );

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

  const {
    data,
    loading,
    error,
    subscribeToMore
  } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page)
  });

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(
        ({ id }) => id === newLink.id
      );
      if (exists) return prev;
  
      return Object.assign({}, prev, {
        feed: {
          links: [...prev.feed.links, newLink],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      });
    }
  });
  
  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  });


  return (
    <div>
      <h1>This WORKS</h1>
      <div>
        Search
        <input
          type="text"
          onChange={(e) => setSearchFilter(e.target.value)}
        />

      </div>
      {data && (
        <>
          {data.feed.links.map((link, index) => (
            <Link key={link.id} link={link} index={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default LinkList;