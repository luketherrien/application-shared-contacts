import UserRelationship from './UserRelationshipInterface';

/**
 * Represents a relationship between two users.
 * 
 * Also contains the number of shared phone numbers between the two users.
 */
export default interface UserRelationshipWithCount extends UserRelationship {
  numberOfSharedPhoneNumbers: number
};
