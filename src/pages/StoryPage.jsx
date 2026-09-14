import React from 'react';
import { Link } from 'react-router-dom';
import Images from '../assets/images';
import { ArrowRight } from '../components/Icons';
import SEO from '../components/SEO';
import { useData } from '../context/DataContext';

export function StoryPage() {
  const { content } = useData();

  return (
    <div className="story-page">
      <SEO
        title="Notre Histoire & Origines"
        description="Découvrez l'histoire de Khatra : du premier chariot de café à Hay Sadri à Casablanca jusqu'à un écosystème de référence au Maroc."
      />

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-bg">
          <img src={Images.khatra.hero} alt="Histoire Khatra" />
        </div>
        <div className="page-header-overlay" />
        <div className="page-header-inner">
          <span className="eyebrow">Origines & Vision</span>
          <h1>Notre Histoire</h1>
          <p>
            L’aventure humaine et passionnée d’une marque marocaine née de la rue, grandie par l’exigence et tournée vers l’avenir.
          </p>
        </div>
      </div>

      {/* Story Intro */}
      <div className="story-intro">
        <span className="eyebrow">La Genèse</span>
        <h2>De la passion brute à un écosystème de référence.</h2>
        <p>
          {content?.brandStoryIntro || 'Née au cœur de Casablanca, Khatra incarne l’évolution moderne de la culture café au Maroc.'}
        </p>
      </div>

      {/* Story Timeline */}
      <div className="story-timeline">
        {/* Milestone 01 */}
        <div className="timeline-item">
          <div>
            <div className="timeline-num">01</div>
            <div className="timeline-meta">Casablanca · Hay Sadri</div>
            <h3>Les Racines Populaires</h3>
            <p>
              Tout a commencé dans l’effervescence de Hay Sadri à Casablanca. Inspiré par les rituels du café de quartier et la convivialité des discussions marocaines, le projet est né d’un rêve simple : offrir un café d’exception au juste prix.
            </p>
          </div>
          <div className="timeline-img">
            <img src={Images.khatra.brand3} alt="Hay Sadri Casablanca" loading="lazy" />
          </div>
        </div>

        {/* Milestone 02 */}
        <div className="timeline-item reverse">
          <div>
            <div className="timeline-num">02</div>
            <div className="timeline-meta">Contact Direct & Proximité</div>
            <h3>The Coffee Cart</h3>
            <p>
              Pour tester et peaufiner les recettes au contact réel des amateurs de café, un chariot ambulant au design soigné a sillonné les rues. Le succès immédiat des boissons signatures a confirmé l’appétit des Marocains pour la nouveauté.
            </p>
          </div>
          <div className="timeline-img">
            <img src={Images.khatra.khatra360} alt="Le chariot de café Khatra" loading="lazy" />
          </div>
        </div>

        {/* Milestone 03 */}
        <div className="timeline-item">
          <div>
            <div className="timeline-num">03</div>
            <div className="timeline-meta">Identité & Signature</div>
            <h3>La Naissance de la Marque</h3>
            <p>
              Khatra (une goutte en arabe, symbole de perfection et de concentration d’arômes) s’est structurée autour d’une identité visuelle forte, bordeaux et caramel, alliant fierté nationale et modernité cosmopolite.
            </p>
          </div>
          <div className="timeline-img">
            <img src={Images.slogans.slogan1} alt="L'identité Khatra" loading="lazy" />
          </div>
        </div>

        {/* Milestone 04 */}
        <div className="timeline-item reverse">
          <div>
            <div className="timeline-num">04</div>
            <div className="timeline-meta">Innovation & B2B</div>
            <h3>L’Expansion de la Gamme</h3>
            <p>
              Face à la demande des professionnels de la restauration, Khatra a lancé ses gammes de sirops gourmands Nidsys, ses bubbles de fruits et ses mélanges de café torréfiés sur mesure, devenant un fournisseur incontournable.
            </p>
          </div>
          <div className="timeline-img">
            <img src={Images.nidsys.syrupTrio} alt="Gamme Sirops et Bubbles" loading="lazy" />
          </div>
        </div>

        {/* Milestone 05 */}
        <div className="timeline-item">
          <div>
            <div className="timeline-num">05</div>
            <div className="timeline-meta">Aujourd'hui & Demain</div>
            <h3>Le Réseau National en Franchise</h3>
            <p>
              Aujourd’hui, Khatra ouvre ses portes aux entrepreneurs à travers le Maroc grâce à deux concepts de franchise éprouvés : le Coffee Shop d’expérience et le Khatra Market de distribution.
            </p>
          </div>
          <div className="timeline-img">
            <img src={Images.khatra.packaging} alt="Réseau Franchise Khatra" loading="lazy" />
          </div>
        </div>
      </div>

      {/* Story Closing Quote */}
      <div className="story-closing">
        <blockquote>
          « {content?.brandQuote || 'Khatra, c’est plus qu’un café. C’est un moment qu’on a envie de revivre.'} »
        </blockquote>
        <cite>— L’Équipe Fondatrice Khatra</cite>
        <div style={{ marginTop: '40px' }}>
          <Link to="/franchise" className="btn btn-primary">
            Écrire la suite avec nous <ArrowRight s={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StoryPage;
