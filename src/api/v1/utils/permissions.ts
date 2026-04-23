import { Deck } from "../models/deckModel";
import { ROLE } from "../../../constants/roles";

export const canView = (
    deck: Deck, 
    user?: { 
        role: string; 
        uid: string 
    }): boolean => 
{
    if (deck.visibility) return true;
    if (!user) return false;
    if (user.role === ROLES.ADMIN) return true;
    return deck.userId === user.uid;
};

export const canModify = (
    deck: Deck,
    user?: { 
        role: string; 
        uid: string 
    }): boolean => 
{
    if (!user) return false;
    return deck.userId === user.uid;
};

export const canDelete = (
    deck: Deck,
    user?: { 
        role: string; 
        uid: string 
    }): boolean => 
{
    if (!user) return false;
    if (user.role === ROLES.ADMIN) return true;
    return deck.userId === user.uid;
};